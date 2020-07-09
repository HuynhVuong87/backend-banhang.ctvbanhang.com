import { deleteData, getDataAll, getDataWithConditions, getDataWithDocument, ICondition, saveModelsFromProduct, updateData } from "./dataService";
import { create_milisec, saveLog } from "./helper";

const collectionName = "products";
export async function createProduct(product: any, user: { name: string, uid: string }) {
    return new Promise((resolve, reject) => {
        const conditions: ICondition[] = [{
            field: "linked_product_id",
            opera: "==",
            value: product.linked_product_id || ""
        }, {
            field: "gomdon_by.uid",
            opera: "==",
            value: user.uid
        }];
        return getDataWithConditions(collectionName, conditions).then(async (data) => {
            if (data.length === 0) {
                const ctime = Date.now();
                product.classify.forEach((classify: any, index: number) => {
                    classify.gomdon_sku = ((ctime + index + 1).toString(36));
                });
                product.gomdon_sku = ctime.toString(36);
                product.gomdon_by = {
                    name: user.name,
                    uid: user.uid
                };
                product.gomdon_ctime = create_milisec("");
                product.gomdon_logs = saveLog("Tạo Sản Phẩm", 0, user);
                await saveModelsFromProduct(product);
                return (product);
            } else {
                throw "Sản phẩm đã tồn tại";
            }
        }).then((data) => {
            resolve({ code: "success", data });
        }).catch((error) => {
            reject({ code: "error", data: { message: error } });
        });
    });
}

export async function updateProduct(inputData: any, user: { name: string, uid: string }) {
    const product = (await getDataWithDocument("products", inputData.gomdon_id)).mess;
    if (inputData.data) {
        product.gomdon_product_name = inputData.data.gomdon_product_name;
        inputData.data.classify.forEach((classify: any) => {
            const i = product.classify.findIndex((x: any) => x.gomdon_sku === classify.gomdon_sku);
            if (i > -1) {
                product.classify[i].gomdon_name = classify.gomdon_name || product.classify[i].gomdon_name;
                product.classify[i].image = classify.image || product.classify[i].image;
            }
        });

    }
    inputData.data.gomdon_logs = saveLog("Cập nhật", 0, user);
    return new Promise((resolve, reject) => {
        return updateData(collectionName, inputData.gomdon_id, {
            classify: product.classify,
            gomdon_product_name:  product.gomdon_product_name
        })
            .then(() => resolve({ code: "success", data: { message: "cập nhật thành công" } }))
            .catch((err) => reject({ code: "error", data: { message: err } }));
    });
}

export function deleteProduct(gomdonId: string) {
    return new Promise((resolve, reject) => {
        return deleteData(collectionName, gomdonId)
            .then(() => resolve({ code: "success", data: { message: "xoa thành công" } }))
            .catch((err) => reject({ code: "error", data: { message: err } }));
    });
}

export function getAllProduct() {
    return new Promise((resolve, reject) => {
        return getDataAll(collectionName).then((data) => resolve({ code: "success", data })).catch((err) => reject({ code: "error", data: { message: err } }));
    });
}

export function getByIds(linkedProductIds: string[], user: { name: string, uid: string }) {
    return Promise.all(linkedProductIds.map((linkedProductId) => {
        return new Promise((resolve) => {
            const conditions: ICondition[] = [{
                field: "linked_product_id",
                opera: "==",
                value: linkedProductId
            }, {
                field: "gomdon_by.uid",
                opera: "==",
                value: user.uid
            }];
            return getDataWithConditions(collectionName, conditions)
                .then((data) => {
                    if (data.length === 0) {
                        throw "Sản phẩm không tồn tại";
                    } else {
                        resolve({ id: linkedProductId, code: "success", data: data[0] });
                    }
                }).catch((err) => resolve({ id: linkedProductId, code: "error", data: { message: err } }));
        });
    })).then((data) => data).catch((err) => err);
}
