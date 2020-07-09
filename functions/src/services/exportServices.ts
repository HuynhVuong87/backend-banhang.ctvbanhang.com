import admin from "../admin";
import { BatchedWrites, deleteImage, getDataWithConditions, getDataWithDocument, ICondition, updateData, uploadImage } from "./dataService";
import { create_milisec, saveLog, TypeBatch } from "./helper";

export interface ISell {
    order_sn: string;
    shipping_traceno: string;
}

const collectionSell = "sells";
const collectionExport = "export_sells";
export function createExport(sellIds: ISell[], user: { uid: string, name: string }) {
    let actualCarrier: string;
    return Promise.all<{ code: string; data: { message: string }, shipping_traceno?: string,  id: string }>(sellIds.map((sellId) => {
        return new Promise((resolve, reject) => {
            return getDataWithDocument(collectionSell, sellId.order_sn).then((data) => {
                if (data.code === 200) {
                    if (data.mess.gomdon_status === 4 && (data.mess.gomdon_export_id === undefined || data.mess.gomdon_export_id === "")) {
                        let message: string = "";
                        if (!actualCarrier) {
                            actualCarrier = data.mess.actual_carrier;
                            message = "ok đấy";
                        } else {
                            if (actualCarrier === data.mess.actual_carrier) {
                                message = "ok đấy";
                            } else {
                                message = "không cùng nhà vận chuyển";
                            }
                        }
                        resolve({
                            code: "success",
                            data: {
                                message
                            },
                            id: sellId.order_sn,
                            shipping_traceno: sellId.shipping_traceno,
                        });
                    } else {
                        resolve({
                            code: "error",
                            data: {
                                message: "đơn đã có phiếu xuất hoặc chưa đóng gói"
                            },
                            id: sellId.order_sn,
                            shipping_traceno: sellId.shipping_traceno,
                        });
                    }
                }
                if (data.code === 404) {
                    resolve({
                        code: "error",
                        data: {
                            message: "đơn này không tồn tại"
                        },
                        id: sellId.order_sn,
                    });
                }
            }).catch((err) => reject(err));
        });
    })).then((value) => {
        if (value.some((ele) => ele.code === "error")) {
            throw { code: "error", data: value };
        } else {
            const batchs: Array<{ collection: string, method: Array<{ doc: string, type: TypeBatch, data: any }> }> = [];
            const ctime = create_milisec("", true);
            const ctime03 = create_milisec(ctime);
            const data = value.map((ele) => {
                return {
                    data: {
                        gomdon_export_id: ctime.toString(),
                        gomdon_logs: saveLog("Tạo phiếu xuất", 4, user),
                    },
                    doc: ele.id,
                    type: TypeBatch.update,
                };
            });
            batchs.push({
                collection: collectionSell,
                method: data
            });
            batchs.push({
                collection: collectionExport,
                method: [
                    {
                        data: {
                            actual_carrier: actualCarrier,
                            create_by: user.uid,
                            gomdon_ctime: ctime03,
                            gomdon_logs: saveLog("1", 0, user, ctime03),
                            gomdon_sells: value.map((ele) => {
                                return {
                                    order_sn: ele.id,
                                    shipping_traceno: ele.shipping_traceno
                                };
                            }),
                            gomdon_status: 1
                        },
                        doc: ctime.toString(),
                        type: TypeBatch.create
                    }
                ]
            });
            return BatchedWrites(batchs).then(() => {
                return { code: "success", data: ctime.toString() };
            }).catch((err) => { throw { code: "error", data: err }; });
        }

    }).catch((err) => err);
}

export function getByStatus(status: number[], uid: string) {
    const condition: ICondition[] = [{
        field: "gomdon_status",
        opera: "in",
        value: status
    }, {
        field: "create_by",
        opera: "==",
        value: uid
    }];
    return new Promise((resolve, reject) => {
        return getDataWithConditions(collectionExport, condition)
            .then((data: any) => {
                //     return data.map((doc: any) => {
                //         return {
                //             ...doc,
                //             gomdon_sells: doc.gomdon_sells.map((sellid: any) => {
                //                 const conditionSell: ICondition = {
                //                     field: "order_sn",
                //                     opera: "==",
                //                     value: sellid
                //                 };
                //                 return getDataWithConditions(collectionSell, [conditionSell], ["order_id", "order_sn", "shipping_traceno", "gomdon_status", "buyer_user"]);
                //             })
                //         };
                //     });
                // }).then((data) => {
                //     return data.map(async (doc: any) => {
                //         return {
                //             ...doc,
                //             gomdon_sells: await Promise.all(doc.gomdon_sells.map((element: any) => {
                //                 return new Promise((res, rej) => {
                //                     element.then((ele: any) => res(ele[0])).catch((err: any) => res(err));
                //                 });
                //             }))
                //         };
                //     });
                // }).then(async (datas) => {
                //     return Promise.all(datas.map((data: any) => {
                //         return new Promise((reso, reje) => {
                //             data.then((doc: any) => reso(doc));
                //         });
                //     }));
                // }).then((data) => {
                resolve({ code: "success", data });
            }).catch((err) => {
                reject({ code: "error", data: err });
            });
    });
}

export function updateExport(input: any, exportId: string, user: { uid: string, name: string }) {
    return new Promise((resolve, reject) => {
        // tslint:disable-next-line: prefer-const
        const gomdonLogs = [];
        if (input.gomdon_status) {
            gomdonLogs.push(saveLog(input.gomdon_status.toString(), 0, user, undefined, true));
        }
        if (gomdonLogs.length !== 0) {
            input.gomdon_logs = admin.firestore.FieldValue.arrayUnion(...gomdonLogs);
        }
        console.log(exportId, input);
        return updateData(collectionExport, exportId, input)
            .then((data) => resolve({ code: "success", data: "Cập nhật thành công" }))
            .catch((err) => reject({ code: "error", data: err }));
    });
}

export function addSnapshotExport(exportId: string, file: any) {
    return new Promise(async (resolve, reject) => {
        const ctime = create_milisec("");
        // UploadImage(`src/uploads/temp${file.originalname.substring(file.originalname.lastIndexOf("."), file.originalname.length)}`, `snapshot_export/${exportId}_${ctime}`)
        uploadImage(`snapshot_export/${exportId}_${ctime}`, file)
            .then((linkImage) => {
                console.log(linkImage);
                const snapshotExport = admin.firestore.FieldValue.arrayUnion(linkImage);
                return updateExport({ snapshot_export: snapshotExport }, exportId, { uid: "", name: "" });
            }).then((data) => resolve(data))
            .catch((err) => {
                deleteImage(`snapshot_export/${exportId}_${ctime}`);
                console.log(err);
                reject(err);
            });
    });
}

export function getByIdExport(exportId: string) {
    return new Promise(async (resolve, reject) => {
        return getDataWithDocument(collectionExport, exportId).then((data) => {
            if (data.code === 200) {
                resolve({ code: "success", data: data.mess });
            } else {
                throw `Không có phiếu xuất có Id ${exportId}`;
            }
        }).catch((error) => reject({ code: "error", data: { message: error } }));
    });
}
