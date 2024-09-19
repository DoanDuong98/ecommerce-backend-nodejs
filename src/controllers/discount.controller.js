'use strict'

const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async(req, res, next) => {
    new SuccessResponse({
      message: 'Create code successfully!',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getAllDiscountByShop = async(req, res, next) => {
    new SuccessResponse({
      message: 'Successfully!',
      metadata: await DiscountService.getAllDiscountByShop({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getAllDiscountWithProduct = async(req, res, next) => {
    new SuccessResponse({
      message: 'Successfully!',
      metadata: await DiscountService.getAllDiscountWithProduct({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res)
  }

  getDiscountAmount = async(req, res, next) => {
    new SuccessResponse({
      message: 'Successfully!',
      metadata: await DiscountService.getDiscountAmount({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res)
  }
}

module.exports = new DiscountController()
