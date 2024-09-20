'use strict'

const { NotFoundError, BadReqestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const discountService = require("./discount.service");

class CheckoutService {
  /*
    {
      cartId,
      userId,
      shop_order_ids: [
        {
          shopId,
          shop_discounts: [
            {
              shopId,
              discountId,
              codeId
            }
          ],
          item_products: [
            {
              price,
              quantity,
              productId,
            }
          ]
        }
      ]
    }
  */
  static async checkoutReview({ 
    cartId, userId, shop_order_ids
   }) {
    // check cartId
    const cart = await findCartById(cartId);
    if (!cart) throw BadReqestError('Cart not found');

    const checkout_order = {
      totalPrice: 0,
      feeShip: 0, 
      totalDiscount: 0,
      totalCheckout: 0
    }, shop_order_ids_new = []
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];
      const checkProductServer = await checkProductByServer(item_products);

      // Need check all
      if (checkProductServer.some(item => !item)) throw new BadReqestError('order wrong');
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0);

      // calculate tong tien truoc khi xu ly
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products:checkProductServer
      };

      if (shop_discounts.length > 0) {
        // gia su chi co 1 discount
        const { discount = 0, totalOrder, totalPrice = 0 } = await discountService.getDiscountAmount({
          shopId,
          userId,
          codeId: shop_discounts[0].codeId,
          products: checkProductServer
        })
        // tong cong discount giam gia
        checkout_order.totalDiscount += discount;

        // neu tien giam gia > 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
        // tong thanh toan cuoi cung
        checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
        shop_order_ids_new.push(itemCheckout)
      }
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }
}

module.exports = CheckoutService
