import admin from "../admin";
// tslint:disable-next-line: ordered-imports
import {
  addWallet,
  approveTransSV,
  deleteStockOfCTV,
  getDataAll,
  getDataWithConditions,
  getDataWithDocument,
  ICondition,
  updateData,
} from "./dataService";
import { arrayPushFirebase, asyncForEach } from "./helper";

const collectionName = "users";

export interface IUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  photoURL: string;
  password: string;
}

export type IUserDisplay = Pick<IUser, "displayName" | "email" | "photoURL">;

export function transferToWallet(
  desc: string,
  money: number,
  uid: string,
  name: string,
  quanlyBy: string
) {
  return new Promise(async (resolve, reject) => {
    console.log(desc, money);
    await addWallet(desc, money, uid, name, quanlyBy).catch((err) =>
      reject({ code: "error", data: err })
    );
    resolve({ code: "success", data: "Đã gửi yêu cầu nạp vào ví: " + money });
  });
}

export function approveTrans(id: string, type: string) {
  return new Promise(async (resolve, reject) => {
    await approveTransSV(id, type);
    resolve({ code: "success" });
  });
}

export function getUsersWithoutAdmin() {
  return new Promise((resolve, reject) => {
    getDataAll(collectionName)
      .then((data: any) => {
        // console.log(data);
        const users: IUser = data.filter((x: { role: string }) => {
          if (x.role) {
            return x.role !== "admin";
          } else {
            return true;
          }
        });
        resolve({ code: "success", data: users });
      })
      .catch((err) => reject({ code: "error", data: err }));
  });
}

export function createUser(data: any) {
  return new Promise((resolve, reject) => {
    admin
      .auth()
      .setCustomUserClaims(data.uid, { quanlykho: true, role: "quanlykho" })
      .then(async () => {
        console.log(data);
        const userRef = admin.firestore().collection("users").doc(data.uid);
        await userRef.set(
          Object.assign(
            {
              current_stock: {
                uid: data.uid,
                email: data.email,
                name: data.displayName,
              },
              role: "quanlykho",
              isStock: true,
            },
            data
          )
        );
        const { displayName, email, photoURL, uid } = data;
        await userRef.collection("stocks_info").doc(data.email).set({
          displayName,
          email,
          photoURL,
          uid,
        });
        console.log("ok");
        return;
      })
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}

async function rejectStock(stockUID: string) {
  const info = await getDataWithDocument("users", stockUID);
  if (info.mess.role === "quanlykho") {
    const list = await getDataWithConditions("users", [
      {
        field: "current_stock.uid",
        opera: "==",
        value: stockUID,
      },
    ]);
    if (list.length > 0) {
      const uidsCTV = list.map((x) => x.gomdon_id);
      await asyncForEach(uidsCTV, async (uid: string) => {
        await deleteStockOfCTV(uid, info.mess.email);
      });
    }
  }
}

export async function updateRole(uid: string, myrole: string) {
  return new Promise((resolve, reject) => {
    const role = {
      role: myrole,
      [myrole]: true,
    };
    admin
      .auth()
      .setCustomUserClaims(uid, role)
      .then(async () => {
        const dataUpdate = {
          role: myrole,
          isStock: myrole === "quanlykho" ? true : false,
        };
        if (myrole !== "quanlykho") {
          await rejectStock(uid);
        }
        await updateData(collectionName, uid, dataUpdate);
        return;
      })
      .then(() =>
        resolve({ code: "success", data: { message: "Cập nhật thành công" } })
      )
      .catch((error) => reject({ code: "error", data: { message: error } }));
  });
}

export function addQuanlyCTV(email: string, uid: string) {
  return new Promise(async (resolve, reject) => {
    const conditions: ICondition[] = [
      {
        field: "email",
        opera: "==",
        value: email,
      },
      {
        field: "role",
        opera: "==",
        value: "quanlyCTVban",
      },
    ];
    const userQuanlyCTV = await getDataWithConditions("users", conditions);
    if (userQuanlyCTV.length > 0) {
      console.log(userQuanlyCTV);
      await updateData("users", uid, {
        quanlyCTVs: arrayPushFirebase(userQuanlyCTV[0].uid),
      });
      await updateData("users", userQuanlyCTV[0].uid, {
        quanlykhos: arrayPushFirebase(uid),
      });
      resolve({ code: "success", data: "Thêm quản lý CTV bán thành công" });
    } else {
      resolve({ code: "error", data: "email không tồn tại" });
    }
  });
}

export function addCTV(
  detailRole: string = "nhanvienkho",
  email: string,
  quanLyUid: string,
  roleQuanly: string
) {
  return new Promise((resolve, reject) => {
    console.log(email);
    return admin
      .auth()
      .getUserByEmail(email)
      .then((userRecord) => {
        const claims: any = userRecord.customClaims;
        console.log(1, claims);
        if (claims.role === "nguoimoi") {
          let role: any;
          if (roleQuanly === "quanlyCTVmua") {
            role = {
              CTVmua: true,
              quanlyBy: quanLyUid,
              role: "CTVmua",
            };
          } else if (roleQuanly === "quanlykho") {
            role = {
              quanlyBy: quanLyUid,
              role: detailRole,
            };
            role[detailRole] = true;
          } else {
            role = {
              CTVban: true,
              quanlyBy: quanLyUid,
              role: "CTVban",
            };
          }
          return admin
            .auth()
            .setCustomUserClaims(userRecord.uid, role)
            .then(() => ({ userRecord, role }));
        } else {
          throw "email này không phải người mới";
        }
      })
      .then((data: any) => {
        return updateData(collectionName, data.userRecord.uid, {
          role: data.role.role,
          quanlyBy: quanLyUid,
        });
      })
      .then(() =>
        resolve({ code: "success", data: "thêm cộng tác viên thành công" })
      )
      .catch((err) => {
        reject({ code: "error", data: err });
      });
  });
}

export function getCTVs(quanLyUid: string) {
  return new Promise((resolve, reject) => {
    const conditions: ICondition = {
      field: "quanlyBy",
      opera: "==",
      value: quanLyUid,
    };
    return getDataWithConditions(collectionName, [conditions])
      .then((data) => resolve({ code: "success", data }))
      .catch((err) => reject({ code: "error", data: err }));
  });
}
