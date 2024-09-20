'use strict'

const { BadReqestError, NotFoundError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { findAllDiscountUnSelect, checkDiscountExists, findAllDiscountSelect } = require("../models/repositories/discount.repo")
const { findAllProducts } = require("../models/repositories/product.repo")
const { convertToObjectId } = require("../utils")

/*
  Discount service
  1 - 

*/

class DiscountService {
  static async createDiscountCode (payload) {
    const {
      code, start_date, end_date, is_active,
      shopId, min_order_value, product_ids, applies_to, name, description,
      type, value, max_value, max_uses, uses_count, max_uses_per_user, users_used
    } = payload
    // kiem tra
    // if (new Date(start_date) > new Date(end_date) || new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadReqestError("Invalid date!")
    // }
    // Create index for discount
    const findDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shopId: convertToObjectId(shopId)
    }).lean();

    if (findDiscount) {
      throw new BadReqestError("Discount exists!")
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids
    })
    return newDiscount;
  }

  static async updateDiscountCode (payload) {
    // ...
  }

  static async getAllDiscountWithProduct ({
    code, shopId, userId, limit, page
  }) {
    // Create index for discount
    const findDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shopId: convertToObjectId(shopId)
    }).lean();

    if (!findDiscount) throw new NotFoundError("Discount not found!");

    const { discount_applies_to, discount_product_ids } = findDiscount;
    let products;
    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }

    if (discount_applies_to === 'sprecific') {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name']
      })
    }
    return products;
  }

  static async getAllDiscountByShop ({
    shopId, limit, page
  }) {
    const discounts = await findAllDiscountSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectId(shopId),
        discount_is_active: true
      },
      select: ['discount_name', 'discount_code'],
      model: discountModel
    })
    return discounts;
  }

  // Apply discount code
  static async getDiscountAmount ({
    shopId, codeId, userId, products
  }) {
    const findDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: shopId
      }
    })
    if (!findDiscount) throw new NotFoundError("Discount not found!");
    const {
      discount_is_active,
      discount_max_uses,
      discount_end_date,
      discount_start_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value
    } = findDiscount;

    if (!discount_is_active) throw new NotFoundError("Discount expired!");
    if (!discount_max_uses) throw new NotFoundError("Discount are out!");
    if (new Date(discount_start_date) > new Date(discount_end_date) || new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
      throw new BadReqestError("Invalid date!")
    }

    // check xem co gia tri toi thieu hay khong
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)
      if (totalOrder > discount_min_order_value) throw new BadReqestError('Invalid min value order!')
    }

    // Check use per user
    if (discount_max_uses_per_user > 0) {
      const userUseDiscount = discount_users_used.find(user => user.userId === userId)
      if (userUseDiscount) {
        //...
      }
    }

    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value/100);
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }

  static async deleteDiscountCode({codeId, shopId}) {
    // Check anything
    const deleted = await discountModel.findByIdAndDelete({
      discount_code: codeId,
      discount_shopId: shopId
    });
    return deleted
  }

  static async cancelDiscountCode({codeId, shopId, userId}) {
    const findDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: shopId
      }
    });
    if (!findDiscount) throw new NotFoundError("Discount not found!");
    const result = await discountModel.findByIdAndUpdate(findDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1
      }
    })
    return result;
  }
}

module.exports = DiscountService

