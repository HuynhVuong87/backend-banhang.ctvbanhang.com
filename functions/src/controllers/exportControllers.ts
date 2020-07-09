import { Request, Response } from "express";
import * as exportServices from "../services/exportServices";
import { handleError } from "../services/helper";

export async function createExport(req: Request, res: Response, next: Function) {

    try {
        return exportServices.createExport(req.body, { uid: res.locals.uid, name: res.locals.name }).then((data) => {
            // console.log(data);
            res.send(data);
        }).catch((err) => res.status(500).send(err));
        // res.send(req.body);
    } catch (error) { return handleError(error, res); }

}

export async function getByStatus(req: Request, res: Response, next: Function) {

    try {
        const status = JSON.parse("[" + req.query.status + "]");
        return exportServices.getByStatus(status, res.locals.uid).then((data) => res.send(data)).catch((err) => res.status(500).send(err));
    } catch (error) { return handleError(error, res); }

}

export async function updateExport(req: Request, res: Response, next: Function) {

    try {
        console.log(req.body);
        return exportServices.updateExport(req.body.data, req.body.export_id, { uid: res.locals.uid, name: res.locals.name })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send(err);
            });
        // res.send(req.body);
    } catch (error) { return handleError(error, res); }

}

export async function addSnapshotExport(req: any, res: Response, next: Function) {

    try {
        return exportServices.addSnapshotExport(req.body.export_id, req.files[0]).then((data) => { res.send(data); }).catch((err) => res.status(500).send(err));
        // console.log("////////////////////////////////////////////");
        // console.log(req.files);
        // return res.send(req.body);
    } catch (error) { return handleError(error, res); }

}

export async function getByIdExport(req: Request, res: Response, next: Function) {

    try {
        return exportServices.getByIdExport(req.params.export_id).then((data) => { res.send(data); }).catch((err) => res.status(500).send(err));
        // return res.send(req.params.export_id);
    } catch (error) { return handleError(error, res); }

}
