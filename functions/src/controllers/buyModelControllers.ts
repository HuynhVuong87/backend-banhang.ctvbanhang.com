import { Request, Response } from "express";
import * as buyModelServices from "../services/buyModelServices";
import { handleError } from "../services/helper";

export async function getModelOfBuy(req: Request, res: Response, next: Function) {

    try {
        return buyModelServices.getModelOfBuy(req.params.gomdon_buy_id)
            .then((data) => res.send(data))
            .catch((err) => res.status(500).send(err));
        // return res.send(req.params);
    } catch (error) { return handleError(error, res); }

}

export async function updateBuyModel(req: Request, res: Response, next: Function) {

    try {
        return buyModelServices.updateBuyModel(req.body).then((data) => res.send(data)).catch((err) => res.status(500).send(err));
    } catch (error) { return handleError(error, res); }

}
