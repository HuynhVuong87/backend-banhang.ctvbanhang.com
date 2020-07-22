import {
  getDataWithConditions,
  getDataWithDocument,
  ICondition,
  listOrderInReceipt,
} from "./dataService";

export function getReceipt(uid: string) {
  console.log(uid);
  const conditions: ICondition[] = [
    {
      field: "by.uid",
      opera: "==",
      value: uid,
    },
  ];
  return new Promise((r, j) => {
    const getData = getDataWithConditions("receipts", conditions);
    getData
      .then((docs) => r({ code: "success", data: docs }))
      .catch((error) => j({ code: "error", data: { message: error } }));
  });
}

export function getById(id: string, uid: string) {
  return new Promise(async (resolve, reject) => {
    return getDataWithDocument("receipts", id)
      .then(async (data) => {
        if (data.code === 200) {
          if (data.mess.by.uid === uid) {
            data.mess = Object.assign(
              {
                orders: await listOrderInReceipt(id),
              },
              data.mess
            );
            resolve({ code: "success", data: data.mess });
          } else {
            resolve({ code: "error", data: "Not exist for u" });
          }
        } else {
          throw `Không có phiếu thu có Id ${id}`;
        }
      })
      .catch((error) => reject({ code: "error", data: { message: error } }));
  });
}
