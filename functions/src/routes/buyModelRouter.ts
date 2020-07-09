import { Request, Response } from "express";
import * as buyModelControllers from "../controllers/buyModelControllers";

module.exports.getModelOfBuy = function getModelOfBuy(req: Request, res: Response, next: Function) {
    buyModelControllers.getModelOfBuy(req, res, next);
};

module.exports.updateBuyModel = function updateBuyModel(req: Request, res: Response, next: Function) {
    buyModelControllers.updateBuyModel(req, res, next);
};
