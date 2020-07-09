import { Request, Response } from "express";
import * as exportControllers from "../controllers/exportControllers";

module.exports.createExport = function createExport(req: Request, res: Response, next: Function) {
    exportControllers.createExport(req, res, next);
};

module.exports.getByStatus = function getByStatus(req: Request, res: Response, next: Function) {
    exportControllers.getByStatus(req, res, next);
};

module.exports.updateExport = function updateExport(req: Request, res: Response, next: Function) {
    exportControllers.updateExport(req, res, next);
};

module.exports.addSnapshotExport = function addSnapshotExport(req: any, res: Response, next: Function) {
    exportControllers.addSnapshotExport(req, res, next);
};

module.exports.getByIdExport = function getByIdExport(req: any, res: Response, next: Function) {
    exportControllers.getByIdExport(req, res, next);
};
