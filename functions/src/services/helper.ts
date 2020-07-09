import { Response } from "express";
import admin from "../admin";

export function handleError(err: any, res: Response) {
    // console.log("err 500");
    // console.log(err);
    return res.status(500).send({ code: "error", data: { message: err } });
}

export function create_milisec(date: string | number | Date, full?: true): number {
    const d = (date === "" ? new Date() : new Date(date)).getTime().toString();
    if (full) {
        return Number(d);
    }
    return Number(d.substring(0, d.length - 3));
}

export async function asyncForEach(array: any[], callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

export function saveLog(content: any, type: number, user: { name: string, uid: string }, id?: number, returnObj?: true) {
    if (!id) {
        id = (new Date()).getTime();
    }
    if (returnObj) {
        return {
            content,
            id,
            name: user.name,
            type,
            uid: user.uid,
        };
    }
    return admin.firestore.FieldValue.arrayUnion({
        content,
        id,
        name: user.name,
        type,
        uid: user.uid,
    });
}

export function arrayPushFirebase(data: any) {
    return admin.firestore.FieldValue.arrayUnion(data);
}

export enum TypeBatch {
    "update",
    "set",
    "delete",
    "create"
}

export enum BuyStatus {
    "DonMoi" = 1,
    "DaThanhToan" = 2,
    "DaGuiDi" = 3,
    "DaDen" = 4,
    "DaXuatKho" = 8,
    "DaNhapkho" = 9,
    "Huy" = 10,
}

export enum SellStatus {
    "DonNhap" = 0,
    "DonMoi" = 1,
    "DaDongGoi" = 4,
    "DaGuiDi" = 5,
    "KhachDaNhan" = 6,
    "DaHoanVeKho" = 8,
    "DaHuy" = 11
}

export enum BuyModelStatus {
    "ChuaKiem" = 1,
    "DangBan" = 2,
    "HetHang" = 3
}
