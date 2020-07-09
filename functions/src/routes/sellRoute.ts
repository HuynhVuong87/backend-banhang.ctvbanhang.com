import { Request, Response } from "express";
import * as sellControllers from "../controllers/sellControllers";

module.exports.createSell = function createSell(req: Request, res: Response, next: Function) {
    sellControllers.createSell(req, res, next);
};

module.exports.getByIdsSell = function getByIdsSell(req: Request, res: Response, next: Function) {
    sellControllers.getByIdsSell(req, res, next);
};

module.exports.getByStatus = function getByStatus(req: Request, res: Response, next: Function) {
    sellControllers.getByStatus(req, res, next);
};

module.exports.updateSell = function updateSell(req: Request, res: Response, next: Function) {
    sellControllers.updateSell(req, res, next);
};

module.exports.paymentCheckSell = function paymentCheckSell(req: Request, res: Response, next: Function) {
    sellControllers.paymentCheckSell(req, res, next);
};

module.exports.createReceipt = function createReceipt(req: Request, res: Response, next: Function) {
    sellControllers.createReceipt(req, res, next);
};

module.exports.getOweSells = function createReceipt(req: Request, res: Response, next: Function) {
    sellControllers.getOweSells(req, res, next);
};

module.exports.createSingle = function createSingle(req: Request, res: Response, next: Function) {
    sellControllers.createSingle(req, res, next);
};

module.exports.backup = function createSingle(req: Request, res: Response, next: Function) {
    sellControllers.backup(req, res, next);
};

module.exports.addTrans = function addTrans(req: Request, res: Response, next: Function) {
    sellControllers.addTrans(req, res, next);
};
