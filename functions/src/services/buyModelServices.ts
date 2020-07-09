import { getDataWithConditions, getDataWithDocument, ICondition, updateData } from "./dataService";

// const collectionBuy = "buys";
const collectionBuyModel = "buy_models";

export function getModelOfBuy(gomdonBuyId: string) {
    console.log(gomdonBuyId);
    const condition: ICondition = {
        field: "gomdon_buy_id",
        opera: "==",
        value: gomdonBuyId
    };
    return new Promise((resolve, reject) => {
        return getDataWithConditions(collectionBuyModel, [condition])
            .then((data) => {
                if (data.length === 0) {
                    throw `Không có đơn mua có gomdon_buy_id = ${gomdonBuyId}`;
                } else {
                    resolve({ code: "success", data });
                }
            })
            .catch((err) => reject({ code: "error", data: { message: err } }));
    });
}

export async function updateBuyModel(data: any) {
    try {
        const product = (await getDataWithDocument("products", data.gomdon_product_id)).mess;
        if (data.actual_quantity || data.gomdon_name) {
            if (data.gomdon_name) {
                const ind = product.classify.findIndex((x: any) => x.gomdon_sku === data.gomdon_sku);
                product.classify[ind].gomdon_name = data.gomdon_name;

                await updateData("products", data.gomdon_product_id, {
                    classify: product.classify
                });
            }

            if (data.actual_quantity && data.actual_quantity > 0 && data.gomdon_buy_id) {
                const invoice = (await getDataWithDocument("buys", data.gomdon_buy_id)).mess;
                const models = invoice.models;
                const ind1 = models.findIndex((x: any) => x.gomdon_sku === data.gomdon_sku);
                models[ind1].actual_quantity = data.actual_quantity;
                await updateData("buys", data.gomdon_buy_id, {
                    models
                });
            }
        }

        return { code: "success", data: { message: "update thành công" } };
    } catch (error) {
        return {
            code: "error", data: { message: error }
        };
        // return new Promise(async (resolve, reject) => {
        //     getDataWithDocument("products", productId).then(async (res: any) => {
        //         const product = res.mess;
        //         const classify = product.classify;
        //         const index = classify.findIndex((x: any) => x.gomdon_sku === gomdonSku);
        //         classify[index].gomdon_name = data.gomdon_name;
        //         classify[index].actual_quantity = data.actual_quantity;
        //         await updateBuyModelAndProduct(productId, gomdonId, classify, data).catch((err) => {
        //             console.log(err);
        //             reject({ code: "error", data: { message: err } });
        //         });
        //         resolve({ code: "success", data: { message: "update thành công" } });
        //     })
        //         .catch((err) => {
        //             console.log(err);
        //             reject({ code: "error", data: { message: err } });
        //         });
        //     // console.log(product);
        // });
        // const
    }
}
