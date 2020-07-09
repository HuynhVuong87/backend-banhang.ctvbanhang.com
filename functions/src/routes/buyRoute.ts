import { Request, Response } from "express";
import * as buyControllers from "../controllers/buyControllers";

module.exports.createBuy = function createBuy(req: Request, res: Response, next: Function) {
    buyControllers.createBuy(req, res, next);
};

module.exports.updateBuy = function updateBuy(req: Request, res: Response, next: Function) {
    buyControllers.updateBuy(req, res, next);
};

module.exports.getByIdsBuy = function getByIdsBuy(req: Request, res: Response, next: Function) {
    buyControllers.getByIdsBuy(req, res, next);
};

module.exports.getByStatusBuy = function getByStatusBuy(req: Request, res: Response, next: Function) {
    buyControllers.getByStatusBuy(req, res, next);
};

module.exports.getAll = function getAll(req: Request, res: Response, next: Function) {
    buyControllers.getAll(req, res, next);
};
