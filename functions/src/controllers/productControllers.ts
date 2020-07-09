import { Request, Response } from "express";
import { handleError } from "../services/helper";
import * as productServices from "../services/productServices";

export async function createProduct(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    return productServices
      .createProduct(req.body, { name: res.locals.name, uid: res.locals.uid })
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send(err));
    // res.send(req.body);
  } catch (error) {
    return handleError(error, res);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    return productServices
      .deleteProduct(req.params.product_id)
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send(err));
    // res.send(req.body);
  } catch (error) {
    return handleError(error, res);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    return productServices
      .updateProduct(req.body, { name: res.locals.name, uid: res.locals.uid })
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send(err));
    // res.send(req.body);
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getAllProduct(
  req: Request,
  res: Response,
  next: Function
) {
  try {
    return productServices
      .getAllProduct()
      .then((data) => res.send(data))
      .catch((err) => res.status(500).send(err));
    // res.send(req.body);
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getByIds(req: Request, res: Response, next: Function) {
  try {
    if (typeof req.query.linked_product_ids === "string") {
      const linkedProductIds = req.query.linked_product_ids.split(",");
      return productServices
        .getByIds(linkedProductIds, {
          name: res.locals.name,
          uid: res.locals.uid,
        })
        .then((data) => res.send(data))
        .catch((err) =>
          res.status(500).send({ code: "error", data: { message: err } })
        );
    } else {
      return res
        .status(500)
        .send({ code: "error", data: { message: "error" } });
    }
  } catch (error) {
    return handleError(error, res);
  }
}
