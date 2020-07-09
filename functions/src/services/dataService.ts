import admin from "../admin";
import { asyncForEach, create_milisec, SellStatus, TypeBatch } from "./helper";
const db = admin.firestore();

export interface IBatch {
  collection: string;
  method: IBatchMethod[];
}

export interface IBatchMethod {
  doc: string;
  type: TypeBatch;
  data: any;
}

export interface ICondition {
  field: string;
  opera: FirebaseFirestore.WhereFilterOp;
  value: any;
}

export async function approveTransSV(gomdon_id: string, action: string) {
  const tran: any = (
    await getDataWithDocument("wallet_transactions", gomdon_id)
  ).mess;
  const user = (await getDataWithDocument("users", tran.uid)).mess;
  const current_wallet = (user.current_wallet || 0) + tran.money_receive;
  const batch = db.batch();
  batch.update(db.collection("wallet_transactions").doc(gomdon_id), {
    gomdon_status: action === "duyet" ? 2 : 3,
  });
  if (action === "duyet") {
    batch.update(db.collection("users").doc(tran.uid), {
      current_wallet,
    });
  }
  await batch.commit();
}

export async function addWallet(
  desc: string,
  money_receive: number,
  uid: string,
  name: string,
  quanlyBy: string
) {
  // const userReciver = (await getDataWithDocument("users", uidReciver)).mess;
  // const batch = db.batch();
  // const userRef = db.collection("users").doc(uidReciver);
  // // tslint:disable-next-line: variable-name
  // const transaction_logs = userReciver.transaction_logs || [];
  // transaction_logs.push({
  //     from: {
  //         name,
  //         uid
  //     },
  //     id: create_milisec("").toString(),
  //     money,
  //     type: 1
  // });
  // batch.update(userRef, {
  //     current_wallet: (userReciver.current_wallet || 0) + money,
  //     transaction_logs
  // });
  // await batch.commit().catch((err) => {
  // });
  const obj = {
    desc,
    gomdon_ctime: create_milisec(""),
    gomdon_status: 1,
    money_receive,
    move_in: "Ví CTV",
    name,
    quanlyBy,
    uid,
  };
  await db.collection("wallet_transactions").doc().set(obj);
}

export async function createShipment(
  buyId: string,
  user: any,
  buyModels: Array<{ gomdon_id: string; actual_quantity: number }>
) {
  const batch = db.batch();
  const shipmentsRef = db.collection("shipments").doc();
  batch.create(shipmentsRef, {
    gomdon_buy: {
      name: user.name,
      uid: user.uid,
    },
    gomdon_buy_id: buyId,
    gomdon_ctime: create_milisec(""),
    gomdon_status: true,
    models: buyModels,
  });
  for (const item of buyModels) {
    const modelRef = db.collection("product_models").doc(item.gomdon_id);
    const shipments = admin.firestore.FieldValue.arrayUnion(
      ...[
        {
          active: true,
          gomdon_id: shipmentsRef.id,
        },
      ]
    );
    batch.update(modelRef, { shipments });
  }
  await batch.commit();
}

export async function updateBuyModelAndProduct(
  productId: string,
  buyModelId: string,
  classify: any,
  dataBuyModel: any
) {
  const batch = db.batch();
  const proRef = db.collection("products").doc(productId);
  batch.update(proRef, {
    classify,
  });
  const buyModelRef = db.collection("product_models").doc(buyModelId);
  batch.update(buyModelRef, dataBuyModel);
  await batch.commit();
}

export function createReceiptWithBatch(data: any, user: any) {
  return new Promise(async (r, j) => {
    const batchArray = [db.batch()];
    const receiptRef = db.collection("receipts").doc();
    batchArray[0].set(receiptRef, {
      bank: data.bank,
      by: {
        name: user.name,
        uid: user.uid,
      },
      date_receive: data.gomdon_ctime,
      ecom_paid: data.ecom_paid,
      my_money: data.my_money,
      note: data.note || "",
      orders: data.orders.map((x: any) => {
        return {
          order_sn: x.order_sn,
          paid: x.paid,
        };
      }),
    });
    batchArray.push(db.batch());
    let batchIndex = 1;
    let count = 0;
    data.orders.forEach((order: any) => {
      const orderRef = db.collection("sells").doc(order.order_sn);
      let status = 0;
      switch (true) {
        case order.offset < 0:
          status = 1;
          break;
        case order.offset === 0:
          status = 2;
          break;
        case order.offset > 0:
          status = 3;
          break;
      }
      order.transaction_logs.unshift({
        date_receive: order.date_receive,
        desc: order.desc,
        // gomdon_status: status,
        money_receive: order.paid,
        move_in: order.move_in,
        name: user.name,
        receiptId: receiptRef.id,
        uid: user.uid,
      });
      console.log(status);
      const obj: {
        gomdon_ecom_paid: number;
        gomdon_transaction_status: number;
        transaction_logs: any;
        gomdon_status?: number;
      } = {
        gomdon_ecom_paid: order.gomdon_ecom_paid + order.paid,
        gomdon_transaction_status: status,
        transaction_logs: order.transaction_logs,
      };
      // if (status > 1) {
      //     obj.gomdon_status = 9;
      // }
      batchArray[batchIndex].update(orderRef, obj);
      count++;

      if (count === 499) {
        batchArray.push(db.batch());
        batchIndex++;
        count = 0;
      }
    });
    await asyncForEach(batchArray, async (batch: any) => await batch.commit());
    r();
  });
}

export async function getDataAll(collection: string) {
  return new Promise<FirebaseFirestore.DocumentData[]>((resolve, reject) => {
    db.collection(collection)
      .get()
      .then((snap) => {
        const data = snap.docs.map((doc) => {
          const obj = doc.data();
          obj.gomdon_id = doc.id;
          return obj;
        });
        resolve(data);
      })
      .catch((err) => reject(err));
  });
}

export async function createData(
  collection: string,
  data: any,
  document?: string
) {
  return new Promise((resolve, reject) => {
    data.gomdon_ctime = create_milisec("");
    const doc = document
      ? db.collection(collection).doc(document)
      : db.collection(collection).doc();
    doc
      .create(data)
      .then(() => resolve({ ...data, gomdon_id: doc.id }))
      .catch((err) => reject(err));
  });
}

export async function deleteData(collection: string, document: string) {
  return new Promise((resolve, reject) => {
    const doc = db.collection(collection).doc(document);
    doc
      .delete()
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

export async function updateData(collection: string, doc: string, data: any) {
  return new Promise((resolve, reject) => {
    data.gomdon_mtime = create_milisec("");
    db.collection(collection)
      .doc(doc)
      .update(data)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getDataWithDocument(collection: string, document: string) {
  let data: { code: number; mess: any };
  return new Promise<{ code: number; mess: any }>((resolve, reject) => {
    db.collection(collection)
      .doc(document)
      .get()
      .then((doc) => {
        if (doc.exists) {
          data = {
            code: 200,
            mess: Object.assign({ gomdon_id: doc.id }, doc.data()),
          };
        } else {
          data = { code: 404, mess: "not exists" };
        }
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getDataWithDocuments(collection: string, documents: string[]) {
  // const documentRef: FirebaseFirestore.DocumentReference[]  = documents.map((document) => db.collection(collection).doc(document));
  return new Promise((resolve, reject) => {
    db.getAll(
      ...documents.map((document) => db.collection(collection).doc(document))
    ).then((snapShots) =>
      resolve(
        snapShots.map((snap) => {
          const data: any = snap.data();
          data.id = snap.id;
          return data;
        })
      )
    );
  });
}

export async function getDataWithConditions(
  collection: string,
  conditions: ICondition[],
  selects?: string[]
) {
  // return new Promise<FirebaseFirestore.DocumentData[]>((resolve, reject) => {
  let dbCollection: FirebaseFirestore.Query = db.collection(collection);

  conditions.forEach((condition) => {
    dbCollection = dbCollection.where(
      condition.field,
      condition.opera,
      condition.value
    );
  });

  if (selects) {
    dbCollection = dbCollection.select(...selects);
  }

  const docs: FirebaseFirestore.QuerySnapshot = await dbCollection
    .get()
    .catch((err) => {
      return err;
    });
  return docs.docs.map((doc) => {
    const result = doc.data();
    result.gomdon_id = doc.id;
    return result;
  });

  //     dbCollection.get().then((snap) => resolve(snap.docs.map((doc) => {
  //         const result = doc.data();
  //         result.gomdon_id = doc.id;
  //         return result;
  //     }))).catch((err) => reject(err));
  // });
}

export async function deleteStockOfCTV(uid: string, emailStock: string) {
  const batch = db.batch();
  const userRef = db.collection("users").doc(uid);
  batch.delete(userRef.collection("stocks_info").doc(emailStock));
  batch.update(userRef, {
    current_stock: "",
  });
  await batch.commit();
}

export function BatchedWrites(batchs: IBatch[]) {
  const batch = db.batch();
  batchs.forEach((ele) => {
    const collection = db.collection(ele.collection);
    ele.method.forEach((method) => {
      let doc: FirebaseFirestore.DocumentReference;
      if (method.doc === "") {
        doc = collection.doc();
      } else {
        doc = collection.doc(method.doc);
      }
      if (method.type === TypeBatch.set) {
        batch.set(doc, method.data);
      }
      if (method.type === TypeBatch.update) {
        method.data.gomdon_mtime = create_milisec("");
        batch.update(doc, method.data);
      }
      if (method.type === TypeBatch.delete) {
        batch.delete(doc);
      }
      if (method.type === TypeBatch.create) {
        method.data.gomdon_ctime = create_milisec("");
        batch.create(doc, method.data);
      }
    });
  });
  return batch.commit();
}

export function uploadImage(fileName: string, fileBuffer: any) {
  return new Promise((resolve, reject) => {
    const file = admin.storage().bucket().file(fileName);
    file
      .save(fileBuffer.buffer, {
        contentType: fileBuffer.mimetype,
        gzip: true,
        public: true,
      })
      .then(() => {
        resolve(
          `https://storage.googleapis.com/gomdon-74d1a.appspot.com/${fileName}`
        );
      })
      .catch((err) => reject(err));
    // admin.storage().bucket().upload(filePath, { destination: fileName, gzip: true, public: true })
    //     .then(([file]) => resolve(file.metadata.mediaLink.replace("https://storage.googleapis.com/download/storage/v1", "https://firebasestorage.googleapis.com/v0")))
    // .catch((err) => reject(err));
  });
}

export function deleteImage(fileName: string) {
  admin.storage().bucket().file(fileName).delete();
}

export async function minusGoodsInStock(sell: any, uid: string, name: string) {
  const batch = db.batch();
  const items = sell.order_items.filter(
    (x: any) => x.item_model.sku && x.item_model.sku.length > 0
  );
  const outOfStock: any = [];
  await asyncForEach(items, async (item: any) => {
    if (item.item_model.sku !== "") {
      const model = await db
        .collection("product_models")
        .where("gomdon_sku", "==", item.item_model.sku)
        .get();
      let i = 0;
      model.forEach(async (doc: any) => {
        if (i === 0 && doc.data().shipments) {
          const shipments = doc.data().shipments.filter((x: any) => x.active);
          // const check = true;
          let amount = item.amount;
          await asyncForEach(shipments, async (e: any) => {
            const shipRef = db.collection("shipments").doc(e.gomdon_id);
            const shipment = await shipRef.get();
            if (shipment.exists && amount > 0) {
              const models = shipment.data()?.models || [];
              const ind = models.findIndex((x: any) => x.gomdon_id === doc.id);
              const actualQuantity = models[ind].actual_quantity || 0;
              if (actualQuantity !== 0) {
                amount = item.amount - actualQuantity;
                let newQuantity = actualQuantity - item.amount;
                newQuantity = newQuantity < 0 ? 0 : newQuantity;
                models[ind].actual_quantity = newQuantity;
                if (newQuantity === 0) {
                  doc.data().shipments[
                    doc
                      .data()
                      .shipments.findIndex(
                        (x: any) => x.gomdon_id === e.gomdon_id
                      )
                  ] = false;
                }
                batch.update(shipRef, {
                  models,
                });
              }
            }
          });
          if (amount > 0 || shipments.length === 0) {
            outOfStock.push({
              gomdon_id: doc.id,
              sku: item.sku,
            });
          }
          const buyModelRef = db.collection("product_models").doc(doc.id);
          batch.update(buyModelRef, {
            shipments,
          });
        }
        i++;
      });
    }
  });
  sell.gomdon_status = sell.create_handle
    ? SellStatus.DonNhap
    : SellStatus.DonMoi;
  const user1: {
    CTVban: string;
    name: string;
    stockUID?: string;
  } = {
    CTVban: uid,
    name,
  };
  sell.gomdon_logs = [
    {
      content: sell.create_handle ? "0" : "1",
      id: new Date().getTime(),
      name,
      type: 0,
      uid,
    },
  ];
  if (sell.note && sell.note.length > 0) {
    sell.gomdon_logs.push({
      content: sell.note,
      id: new Date().getTime() + 1,
      name: "Shopee",
      type: 1,
      uid,
    });
  }
  // saveLog(sell.gomdon_status.toString(), 0, { name, uid });
  sell.gomdon_by = user1;
  sell.gomdon_ctime = create_milisec("");
  const sellRef = db.collection("sells").doc(sell.order_sn);
  batch.set(sellRef, sell);
  await batch.commit();
  return outOfStock;
}

export async function saveModelsFromProduct(product: any) {
  const batch = db.batch();
  const productRef = db.collection("products").doc();
  batch.set(productRef, product);
  product.classify.forEach((e: any) => {
    const modelRef = db.collection("product_models").doc(e.gomdon_sku);
    batch.set(
      modelRef,
      {
        gomdon_ctime: create_milisec(""),
        gomdon_product_id: productRef.id,
        gomdon_sku: e.gomdon_sku,
      },
      {
        merge: true,
      }
    );
  });
  await batch.commit();
}

export async function getModelDetailInvoice(original_models: any) {
  let i = 0;
  const products: any[] = [];
  await asyncForEach(original_models, async (model: any) => {
    let product = products.find(
      (x: any) => x.gomdon_id === model.gomdon_product_id
    );
    if (product === undefined) {
      product = (await getDataWithDocument("products", model.gomdon_product_id))
        .mess;
      products.push(product);
    }
    original_models[i].gomdon_product_name = product.gomdon_product_name;
    const ori_model = product.classify.find(
      (x: any) => x.gomdon_sku === model.gomdon_sku
    );
    original_models[i].sku_name = ori_model.sku_name;
    original_models[i].gomdon_name = ori_model.gomdon_name;
    original_models[i].image = ori_model.image || "";
    original_models[i].linked_company_name = ori_model.linked_company_name;
    i++;
  });
  return original_models;
}
