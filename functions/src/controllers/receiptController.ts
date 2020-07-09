import { Request, Response } from "express";
import { handleError } from "../services/helper";
import * as receiptServices from "../services/receiptServices";

export async function getReceipt(req: Request, res: Response, next: Function) {

    try {
        return receiptServices.getReceipt(res.locals.uid).then((data) => {
            // console.log(data);
            res.send(data);
        }).catch((err) => res.status(500).send(err));
        // res.send(req.body);
    } catch (error) { return handleError(error, res); }

}

export async function getById(req: Request, res: Response, next: Function) {

    try {
        return receiptServices.getById(req.params.receipt_id, res.locals.uid).then((data) => { res.send(data); }).catch((err) => res.status(500).send(err));
        // return res.send(req.params.export_id);
    } catch (error) { return handleError(error, res); }

}
