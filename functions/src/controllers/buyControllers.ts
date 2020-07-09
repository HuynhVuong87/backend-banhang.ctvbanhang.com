import { Request, Response } from "express";
import * as buyServices from "../services/buyServices";
import { handleError } from "../services/helper";

export async function createBuy(req: Request, res: Response, next: Function) {
  try {
    return buyServices
      .createBuy(req.body, {
        uid: res.locals.uid,
        name: res.locals.name,
        quanlyBy: res.locals.quanlyBy,
      })
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send(err));
    // res.send({ code: "ok", data: req.body });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function updateBuy(req: Request, res: Response, next: Function) {
  try {
    return buyServices
      .updateBuy(req.body.gomdon_id, req.body.buy_model_ids, req.body.data, {
        name: res.locals.name,
        uid: res.locals.uid,
      })
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send(err));
    // res.send({ code: "ok", data: req.body });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getByIdsBuy(req: Request, res: Response, next: Function) {
  try {
    if (req.query.ids && typeof req.query.ids === "string") {
      const buyIds = req.query.ids.split(",");
      let promise;
      if (req.query.fields && typeof req.query.fields === "string") {
        const buyFields = req.query.fields.split(",");
        promise = buyServices.getByIdsBuy(buyIds, buyFields);
      } else {
        promise = buyServices.getByIdsBuy(buyIds);
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
          return res.send(data);
        })
        .catch((err) =>
          res.status(500).send({ code: "error", data: { message: err } })
        );
    } else {
      return res
        .status(500)
        .send({ code: "error", data: { message: "erorr" } });
    }
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getByStatusBuy(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    const status = JSON.parse("[" + req.query.status + "]");
    return buyServices
      .getByStatusBuy(status)
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send(err));
    // return res.send(req.query);
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getAll(req: Request, res: Response, next: Function) {
  try {
    return buyServices
      .getAll(res.locals.uid)
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send(err));
    // return res.send(req.query);
  } catch (error) {
    return handleError(error, res);
  }
}
