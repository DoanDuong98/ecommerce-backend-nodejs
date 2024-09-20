'use strict'

const { BadReqestError } = require("../core/error.response");
const { inventory } = require("../models/inventory.model")
const { findProductById } = require("../models/repositories/product.repo")

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = 'Ha Noi'
    }) {
        const product = await findProductById(productId);
        if (!product) throw new BadReqestError('The product not found');

        const query = { inven_shopId: shopId, inven_productId: productId },
        updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }, options = { upsert: true, new: true }

        return await inventory.findOneAndUpdate(query, updateSet, options);
    }
}

module.exports = InventoryService
