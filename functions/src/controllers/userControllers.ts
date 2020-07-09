import { Request, Response } from "express";
import { handleError } from "../services/helper";
import * as userSevices from "../services/userSevices";

export function updateRole(req: Request, res: Response, next: Function) {
  return userSevices
    .updateRole(req.body.uid, req.body.role)
    .then((message) => {
      return res.send(message);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
}

export function transferToWallet(req: Request, res: Response, next: Function) {
  try {
    return userSevices
      .transferToWallet(
        req.body.desc,
        req.body.money,
        res.locals.uid,
        res.locals.name,
        res.locals.quanlyBy
      )
      .then((m) => res.send(m))
      .catch((err) => res.sendStatus(500));
  } catch (error) {
    return handleError(error, res);
  }
}

export function approveTrans(req: Request, res: Response, next: Function) {
  try {
    return userSevices
      .approveTrans(req.body.gomdon_id, req.body.action)
      .then((m) => res.send(m))
      .catch((err) => res.sendStatus(500));
  } catch (error) {
    return handleError(error, res);
  }
}

export function getAllUser(req: Request, res: Response, next: Function) {
  try {
    return userSevices
      .getUsersWithoutAdmin()
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send(err));
  } catch (error) {
    return handleError(error, res);
  }
}

export function createUser(req: Request, res: Response, next: Function) {
  try {
    return userSevices
      .createUser(req.body)
      .then(() =>
        res.status(200).send({
          code: "success",
          data: "Tạo tài khoản thành công",
        })
      )
      .catch((err) => res.sendStatus(202));
  } catch (error) {
    return handleError(error, res);
  }
}

export async function addCTV(req: Request, res: Response, next: Function) {
  try {
    return userSevices
      .addCTV(
        req.body.detailRole,
        req.body.email,
        res.locals.uid,
        res.locals.role
      )
      .then((mess) => {
        res.send(mess);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (error) {
    handleError(error, res);
  }
}

export async function addQuanlyCTV(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    return userSevices
      .addQuanlyCTV(req.body.email, res.locals.uid)
      .then((mess) => {
        res.send(mess);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (error) {
    handleError(error, res);
  }
}

export async function getCTVs(req: Request, res: Response, next: Function) {
  try {
    return userSevices
      .getCTVs(res.locals.uid)
      .then((mess) => {
        res.send(mess);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (error) {
    handleError(error, res);
  }
}

export async function deleteCTV(req: Request, res: Response, next: Function) {
  // return updateRole(req, res, next);
  return userSevices
    .updateRole(req.params.uid, "nguoimoi")
    .then((message) => {
      return res.send(message);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
}
