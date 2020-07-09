import { Request, Response } from "express";
import * as userControllers from "../controllers/userControllers";
module.exports.createUser = function createUser(req: Request, res: Response, next: Function) {
    userControllers.createUser(req, res, next);
};

module.exports.updateRole = function updateRole(req: Request, res: Response, next: Function) {
    userControllers.updateRole(req, res, next);
};

module.exports.getAllUser = function getAllUser(req: Request, res: Response, next: Function) {
    userControllers.getAllUser(req, res, next);
};

module.exports.addCTV = function addCTV(req: Request, res: Response, next: Function) {
    userControllers.addCTV(req, res, next);
};

module.exports.addQuanlyCTV = function addQuanlyCTV(req: Request, res: Response, next: Function) {
    userControllers.addQuanlyCTV(req, res, next);
};

module.exports.getCTVs = function getCTVs(req: Request, res: Response, next: Function) {
    userControllers.getCTVs(req, res, next);
};

module.exports.deleteCTV = function deleteCTV(req: Request, res: Response, next: Function) {
    userControllers.deleteCTV(req, res, next);
};

module.exports.transferToWallet = function transferToWallet(req: Request, res: Response, next: Function) {
    userControllers.transferToWallet(req, res, next);
};

module.exports.approveTrans = function approveTrans(req: Request, res: Response, next: Function) {
    userControllers.approveTrans(req, res, next);
};
