import { Request, Response } from "express";
import * as productControllers from "../controllers/productControllers";

module.exports.createProduct = function createProduct(req: Request, res: Response, next: Function) {
    productControllers.createProduct(req, res, next);
};

module.exports.updateProduct = function updateProduct(req: Request, res: Response, next: Function) {
    productControllers.updateProduct(req, res, next);
};

module.exports.getAllProduct = function getAllProduct(req: Request, res: Response, next: Function) {
    productControllers.getAllProduct(req, res, next);
};

module.exports.getByIds = function getByIds(req: Request, res: Response, next: Function) {
    productControllers.getByIds(req, res, next);
};

module.exports.deleteProduct = function deleteProduct(req: Request, res: Response, next: Function) {
    productControllers.deleteProduct(req, res, next);
};
