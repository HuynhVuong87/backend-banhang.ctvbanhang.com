import admin from "../admin";

import { BatchedWrites, createShipment, getDataWithConditions, getDataWithDocuments, getModelDetailInvoice, IBatch, ICondition, updateData } from "./dataService";
import { asyncForEach, BuyModelStatus, BuyStatus, create_milisec, saveLog, TypeBatch } from "./helper";

const collectionBuy = "buys";
const collectionProduct = "products";

export function createBuy(inputData: any, user: { uid: string, name: string, quanlyBy: string }) {
    return new Promise((resolve, reject) => {
        const condition: ICondition = {
            field: "buy_id",
            opera: "==",
            value: inputData.buy.buy_id
        };
        // kiểm tra đơn nhập đã tồn tại chưa??
        return getDataWithConditions(collectionBuy, [condition]).then((docs) => {
            if (docs.length === 0) {
                // xử lý buymodel
                const batchs: IBatch[] = [];
                const ctime = create_milisec("", true);
                inputData.buy.gomdon_product_ids = [];
                inputData.buy.origin_price = 0;
                inputData.buyModel.forEach((model: any) => {
                    model.gomdon_buy_id = ctime.toString();
                    model.gomdon_status = BuyModelStatus.ChuaKiem;
                    // batchMethod.push({
                    //     data: model,
                    //     doc: "",
                    //     type: TypeBatch.create
                    // });
                    inputData.buy.origin_price += model.price * model.quantity;
                    // tslint:disable-next-line: no-unused-expression
                    inputData.buy.gomdon_product_ids.includes(model.gomdon_product_id) ? "" : inputData.buy.gomdon_product_ids.push(model.gomdon_product_id);
                });
                inputData.buy.origin_price = inputData.buy.origin_price.toFixed(2);
                // batchs.push({
                //     collection: collectionBuyModel,
                //     method: batchMethod
                // });

                // xử lý Buy
                inputData.buy.models = inputData.buyModel.map((x: any) => new Object({
                    actual_quantity: x.quantity,
                    gomdon_product_id: x.gomdon_product_id,
                    gomdon_sku: x.gomdon_sku,
                    price: x.price,
                    quantity: x.quantity,
                }));
                inputData.buy.status = BuyStatus.DonMoi;
                inputData.buy.gomdon_logs = saveLog(inputData.buy.status, 0, user);
                inputData.buy.gomdon_by = {
                    name: user.name,
                    uid: user.uid,
                };
                // tslint:disable-next-line: no-unused-expression
                user.quanlyBy ? inputData.buy.gomdon_by.belong = user.quanlyBy : "";
                batchs.push({
                    collection: collectionBuy,
                    method: [{
                        data: inputData.buy,
                        doc: ctime.toString(),
                        type: TypeBatch.create
                    }]
                });
                return BatchedWrites(batchs);
            } else {
                throw "Đơn đã tồn tại";
            }
        }).then(() => resolve({ code: "success", data: { message: "Tạo đơn nhập thành công" } })
        ).catch((err) => {
            reject({ code: "error", data: { message: err } });
        });
    });
}

export function updateBuy(gomdonId: string, buyModelIds: Array<{ gomdon_id: string, actual_quantity: number }>, data: any, user: { uid: string, name: string }) {
    return new Promise(async (resolve, reject) => {
        const logBuys = [];
        const idLog = create_milisec("", true);
        if (data.note) { // Nếu cập nhật note thì thêm log
            logBuys.push(saveLog(data.note, 1, user, idLog, true));
        }
        if (data.status) { // Nếu cập nhật status thì thêm log
            logBuys.push(saveLog(data.status, 0, user, idLog, true));
            if (data.status === 9) {
                if (buyModelIds.length > 0) {
                    await createShipment(gomdonId, user, buyModelIds);
                }
            }
        }
        if (logBuys.length !== 0) {
            data.gomdon_logs = admin.firestore.FieldValue.arrayUnion(...logBuys); // tạo log cho collection buys
        }
        return updateData(collectionBuy, gomdonId, data)
            .then(() => resolve({ code: "success", data: { message: "Cập nhật đơn nhập thành công" } }))
            .catch((err) => reject({ code: "error", data: { message: err } }));
    });
}

export async function getByIdsBuy(buyIds: string[], fields?: string[]) {
    // return Promise.all(buyIds.map((id) => {
    //     return new Promise<{ id: string, code: string, data: object }>((resolve) => {
    //         let promise;
    // if (fields) {
    //     promise = getDataWithConditions(collectionBuy, [{ field: "buy_id", opera: "==", value: id }], fields);
    // } else {
    //     promise = getDataWithConditions(collectionBuy, [{ field: "buy_id", opera: "==", value: id }]);
    // }
    //         promise.then((data) => {
    //             if (data[0]) {
    //                 resolve({ id, code: "success", data: data[0] });
    //             } else {
    //                 resolve({ id, code: "error", data: { message: "đơn không tồn tại" } });
    //             }
    //         }).catch((err) => resolve({ id, code: "error", data: err }));
    //     });
    // })).then((value) => value).catch((err) => err);
    const res: any = [];
    await asyncForEach(buyIds, async (id: string) => {
        let invoice: any;

        if (fields) {
            invoice = await getDataWithConditions(collectionBuy, [{ field: "buy_id", opera: "==", value: id }], fields);
        } else {
            invoice = await getDataWithConditions(collectionBuy, [{ field: "buy_id", opera: "==", value: id }]);
        }

        if (invoice) {
            invoice = invoice[0];
            invoice.models = await getModelDetailInvoice(invoice.models);
            res.push({
                code: "success",
                data: invoice,
                id,
            });
        } else {
            res.push({
                code: "error",
                data: { message: "đơn không tồn tại" },
                id,
            });
        }
    });
    return res;
}

export async function getAll(uid: string) {
    const conditions: ICondition[] = [{
        field: "gomdon_by.uid",
        opera: "==",
        value: uid
    }];
    const data = await getDataWithConditions("buys", conditions);
    if (data) {
        let i = 0;
        await asyncForEach(data, async (invoice: any) => {
            data[i].models = await getModelDetailInvoice(invoice.models);
            i++;
        });
        return { code: "success", data };
    }
    return;
}

export function getByStatusBuy(status: number[]) {
    const conditions: ICondition[] = [{
        field: "status",
        opera: "in",
        value: status
    }];
    return new Promise((resolve, reject) => {
        getDataWithConditions(collectionBuy, conditions)
            .then(async (data: any) => {
                return data.map(async (buy: any) => {
                    const products: any = await getDataWithDocuments(collectionProduct, buy.gomdon_product_ids);
                    buy.products = products.map((product: any) => ({
                        gomdon_product_name: product.gomdon_product_name,
                        images_preview: product.images_preview
                    }));
                    return buy;
                });
            }).then((datas) => {
                return Promise.all(datas.map((data: any) => {
                    return new Promise((res) => res(data));
                }));
            }).then((data) => {
                resolve({ code: "success", data });
            }).catch((err) => {
                reject({ code: "error", data: { message: err } });
            });
    });
}
