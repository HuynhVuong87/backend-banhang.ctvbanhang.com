import {
  BatchedWrites,
  createData,
  createReceiptWithBatch,
  getDataWithConditions,
  getDataWithDocument,
  IBatch,
  ICondition,
  minusGoodsInStock,
  updateData,
} from "./dataService";
import { saveLog, SellStatus, TypeBatch } from "./helper";

const collectionSell = "sells";
// const collectionOrderItem = "order_items";
const notFoundSell = "đơn không tồn tại";

export async function addTrans(data: any, uid: string, name: string) {
  const sell = await getDataWithDocument("sells", data.gomdon_id);
  const tranLogs = sell.mess.transaction_logs || [];
  const a = new Date();
  const obj = Object.assign(
    {
      date_receive: `${a.getDate()}/${a.getMonth()}/${a.getFullYear()} ${a.getHours()}:${a.getMinutes()}`,
      name,
      uid,
    },
    data
  );
  delete obj.gomdon_id;
  tranLogs.unshift(obj);
  await updateData("sells", data.gomdon_id, {
    transaction_logs: tranLogs,
  });
  return {
    code: "success",
    data: obj,
  };
}

export async function createSingle(
  sell: any,
  user: { uid: string; name: string }
) {
  return new Promise(async (r, j) => {
    getDataWithDocument(collectionSell, sell.order_sn)
      .then(async (data) => {
        if (data.code === 404) {
          const outStock = await minusGoodsInStock(sell, user.uid, user.name);
          r({
            code: "success",
            data: { message: "tạo đơn thành công", outStock },
            id: sell.order_sn,
          });
        } else {
          throw "đơn đã tồn tại";
        }
        // if (data.code === 200) {
        // }
      })
      .catch((err) => {
        r({ id: sell.order_sn, code: "error", data: { message: err } });
      });
  });
}

export async function backup(sell: any) {
  return new Promise(async (r, j) => {
    sell.gomdon_id = sell.order_sn;
    sell.gomdon_export_id = sell.exportId;
    sell.gomdon_status = 5;
    sell.gomdon_logs = [];
    sell.gomdon_ctime = sell.ctime;
    sell.backup = true;
    sell.buyer_user.user_name = sell.user.name;
    await createData("sells", sell, sell.order_sn);
    r({
      code: "success",
      data: { message: "tạo đơn thành công" },
      id: sell.order_sn,
    });
  });
}

export async function createSell(
  sells: any,
  user: { uid: string; name: string; quanlyBy: string }
) {
  return Promise.all(
    sells.map((sell: any, index: number) => {
      return new Promise((resolve, reject) => {
        getDataWithDocument(collectionSell, sell.order_sn)
          .then((data) => {
            if (data.code === 404) {
              const batchs: IBatch[] = [];
              // const batchMethod: IBatchMethod[] = sell.order_items.map((orderItem: any) => {
              //     orderItem.gomdon_sell_id = sell.order_sn;
              //     return ({
              //         data: orderItem,
              //         doc: "",
              //         type: TypeBatch.create
              //     });
              // });
              // batchs.push({
              //     collection: collectionOrderItem,
              //     method: batchMethod
              // });
              sell.gomdon_status = SellStatus.DonMoi;
              sell.gomdon_logs = saveLog(
                sell.gomdon_status.toString(),
                0,
                user
              );
              sell.gomdon_by = {
                CTVban: user.uid,
                quanlyCTVban: user.quanlyBy,
              };
              batchs.push({
                collection: collectionSell,
                method: [
                  {
                    data: sell,
                    doc: sell.order_sn,
                    type: TypeBatch.create,
                  },
                ],
              });
              return BatchedWrites(batchs).then(() =>
                resolve({
                  code: "success",
                  data: { message: "tạo đơn thành công" },
                  id: sell.order_sn,
                })
              );
            } else {
              throw "đơn đã tồn tại";
            }
            // if (data.code === 200) {
            // }
          })
          .catch((err) => {
            resolve({
              id: sell.order_sn,
              code: "error",
              data: { message: err },
            });
          });
      });
    })
  )
    .then((value) => ({ message: value }))
    .catch((err) => err);
}

export function getByIdsSell(sellids: string[], fields?: string[]) {
  return Promise.all(
    sellids.map((id) => {
      return new Promise<{ id: string; code: string; data: object }>(
        (resolve, reject) => {
          const promise = getDataWithConditions(
            collectionSell,
            [{ field: "order_sn", opera: "==", value: id.trim() }],
            fields
          );
          promise
            .then(async (data) => {
              if (data.length === 0) {
                data = await getDataWithConditions(
                  collectionSell,
                  [
                    {
                      field: "shipping_traceno",
                      opera: "==",
                      value: id.trim(),
                    },
                  ],
                  fields
                );
              }
              resolve({
                id,
                code: data.length === 0 ? "error" : "success",
                data: data.length === 0 ? { message: notFoundSell } : data[0],
              });
            })
            .catch((err) => resolve({ id, code: "error", data: err }));
        }
      );
    })
  )
    .then((value) => value)
    .catch((err) => err);
}

export function updateSell(datas: any, user: { uid: string; name: string }) {
  return Promise.all(
    datas.map((ele: any) => {
      return new Promise((resolve, reject) => {
        if (ele.data.gomdon_status) {
          if (ele.data.gomdon_status === 5) {
            ele.data.gomdon_transaction_status = 0;
          }
          if (ele.data.gomdon_status === 6) {
            ele.data.gomdon_status = 5;
          }
          if (ele.data.gomdon_status === 8 && ele.data.gomdon_status === 9) {
            ele.data.gomdon_transaction_status = false;
          }
          ele.data.gomdon_logs = saveLog(ele.data.gomdon_status, 0, user);
        }
        if (ele.data.gomdon_note) {
          ele.data.gomdon_logs = saveLog(ele.data.gomdon_note, 1, user);
        }
        updateData(collectionSell, ele.id, ele.data)
          .then(() =>
            resolve({
              id: ele.id,
              code: "success",
              data: { message: "update thành công" },
            })
          )
          .catch((err) =>
            resolve({ id: ele.id, code: "error", data: { message: err } })
          );
      });
    })
  )
    .then((data) => data)
    .catch((err) => err);
}

export function getByStatus(
  shopId: number,
  status: number[],
  fields?: string[]
) {
  const conditions: ICondition[] = [
    {
      field: "gomdon_status",
      opera: "in",
      value: status,
    },
  ];

  if (shopId) {
    conditions.push({
      field: "shop_id",
      opera: "==",
      value: shopId,
    });
  }
  return new Promise((resolve, reject) => {
    let getData;
    if (fields) {
      getData = getDataWithConditions(collectionSell, conditions, fields);
    } else {
      getData = getDataWithConditions(collectionSell, conditions);
    }
    getData
      .then((docs) => resolve({ code: "success", data: docs }))
      .catch((error) => reject({ code: "error", data: { message: error } }));
  });
}

export function getOweSells(uid: string, fields?: string[]) {
  const conditions: ICondition[] = [
    {
      field: "gomdon_status",
      opera: "==",
      value: 5,
    },
    {
      field: "gomdon_by.CTVban",
      opera: "==",
      value: uid,
    },
  ];
  return new Promise((resolve, reject) => {
    const getData = getDataWithConditions(collectionSell, conditions, fields);
    getData
      .then((docs) =>
        resolve({
          code: "success",
          data: docs,
          // .filter( (x) => !x.gomdon_transaction_status || x.gomdon_transaction_status < 2 )
        })
      )
      .catch((error) => reject({ code: "error", data: { message: error } }));
  });
}

export function paymentCheckSell(paymentCheckDatas: any[], uid: string) {
  return Promise.all(
    paymentCheckDatas.map((paymentCheckData) => {
      return new Promise(async (resolve, reject) => {
        const sell = await getDataWithDocument(
          collectionSell,
          paymentCheckData.id
        );
        if (sell.code === 200) {
          if (sell.mess.gomdon_by.CTVban === uid) {
            const ecomPaid =
              (sell.mess.gomdon_ecom_paid || 0) + paymentCheckData.paid;
            // let rebate = 0;
            // sell.mess.order_items.forEach((item: any) => {
            //     rebate += +item.item_model.rebate_price || 0;
            // });
            const rebate = sell.mess.product_rebate_by_shopee || 0;
            const buyerPaidAmount = sell.mess.buyer_paid_amount;
            const coinsByVoucher = sell.mess.voucher_absorbed_by_seller
              ? +sell.mess.voucher_price
              : 0;
            const cardTxnFeeInfo = sell.mess.card_txn_fee_info.card_txn_fee;
            const offset =
              ecomPaid -
              (buyerPaidAmount -
                coinsByVoucher -
                cardTxnFeeInfo -
                (+sell.mess.seller_service_fee || 0) +
                rebate);
            resolve({
              id: paymentCheckData.id,
              code: "success",
              data: { offset, sell },
            });
          } else {
            resolve({
              id: paymentCheckData.id,
              code: "error",
              data: { message: "Đơn này không ton tai" },
            });
          }
        } else {
          resolve({
            id: paymentCheckData.id,
            code: "error",
            data: { message: "Đơn này không ton tai" },
          });
        }
      });
    })
  );
}

export async function createReceipt(
  data: any[],
  user: { uid: string; name: string }
) {
  await createReceiptWithBatch(data, user);
  return { code: "success", data: "create and update transaction successed!" };
}
