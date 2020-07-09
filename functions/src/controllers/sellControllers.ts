import { Request, Response } from "express";
import { handleError } from "../services/helper";
import * as sellServices from "../services/sellServices";

export async function createSell(req: Request, res: Response, next: Function) {
  try {
    return sellServices
      .createSell(req.body, {
        uid: res.locals.uid,
        name: res.locals.name,
        quanlyBy: res.locals.quanlyBy,
      })
      .then((status) => {
        status.message.sort((a: any, b: any) => {
          if (a.code > b.code) {
            return 1;
          }
          if (a.code < b.code) {
            return -1;
          }
          return 0;
        });
        res.send(status.message);
      })
      .catch((err) => res.status(400).send({ message: err }));
  } catch (error) {
    return handleError(error, res);
  }

  // upOrderTest().then(() => { res.send("ok"); }).catch((err) => { res.send(err); });
}

export async function createReceipt(
  req: Request,
  res: Response,
  next: Function
) {
  const resp = await sellServices.createReceipt(req.body, {
    uid: res.locals.uid,
    name: res.locals.name,
  });
  res.send(resp);
}

export async function backup(req: Request, res: Response, next: Function) {
  const resp = await sellServices.backup(req.body);
  res.send(resp);
}

export async function getByIdsSell(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    if (req.query.ids && typeof req.query.ids === "string") {
      const sellIds = req.query.ids.split(",");
      let promise;
      if (req.query.fields && typeof req.query.fields === "string") {
        const sellFields = req.query.fields.split(",");
        promise = sellServices.getByIdsSell(sellIds, sellFields);
      } else {
        promise = sellServices.getByIdsSell(sellIds);
      }
      return promise
        .then((data) => {
          data.sort((a: any, b: any) => {
            if (a.code > b.code) {
              return 1;
            }
            if (a.code < b.code) {
              return -1;
            }
            return 0;
          });
          res.send(data);
        })
        .catch((err) => res.status(500).send({ message: err }));
    } else {
      return res.status(500).send({ message: "errorr" });
    }
  } catch (error) {
    return handleError(error, res);
  }
}

export async function updateSell(req: Request, res: Response, next: Function) {
  try {
    console.log(req.body);
    return sellServices
      .updateSell(req.body, { uid: res.locals.uid, name: res.locals.name })
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send({ message: err }));
  } catch (error) {
    return handleError(error, res);
  }
}

export async function createSingle(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    return sellServices
      .createSingle(req.body, {
        uid: res.locals.uid,
        name: res.locals.name,
      })
      .then((data: any) => res.send(data))
      .catch((err: any) => res.status(500).send({ message: err }));
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getByStatus(req: Request, res: Response, next: Function) {
  try {
    // console.log(req.query.field);
    if (req.query.shop_id) {
      const status = JSON.parse("[" + req.query.status + "]");
      let promise;
      if (req.query.field && typeof req.query.field === "string") {
        const field = req.query.field.split(",");
        // const field = JSON.parse("[" + req.query.field + "]");
        // console.log(field);
        promise = sellServices.getByStatus(+req.query.shop_id, status, field);
      } else {
        promise = sellServices.getByStatus(+req.query.shop_id, status);
      }
      // res.send("d");
      return promise
        .then((data) => res.send(data))
        .catch((error) => {
          res.status(500).send(error);
        });
    }
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getOweSells(req: Request, res: Response, next: Function) {
  try {
    const promise = sellServices.getOweSells(res.locals.uid);
    // res.send("d");
    return promise
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function paymentCheckSell(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    // console.log(req.query.field);
    return sellServices
      .paymentCheckSell(req.body, res.locals.uid)
      .then((data) => res.send(data))
      .catch((error) => res.status(500).send(error));
    // return res.send(req.body);
  } catch (error) {
    return handleError(error, res);
  }
}

export async function addTrans(req: Request, res: Response, next: Function) {
  try {
    return sellServices
      .addTrans(req.body, res.locals.uid, res.locals.name)
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
