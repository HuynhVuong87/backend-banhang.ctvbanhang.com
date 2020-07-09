import { Request, Response } from "express";
import * as receiptControllers from "../controllers/receiptController";

module.exports.getReceipt = function getReceipt(req: Request, res: Response, next: Function) {
    receiptControllers.getReceipt(req, res, next);
};

module.exports.getById = function getById(req: Request, res: Response, next: Function) {
    receiptControllers.getById(req, res, next);
};
