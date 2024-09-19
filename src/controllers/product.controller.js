'use strict'

const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
// const ProductServiceV2 = require("../services/product.service.xxx");

class ProductController {
  createProduct = async(req, res, next) => {
    new SuccessResponse({
      message: 'Create new Product success!',
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  updateProduct = async(req, res, next) => {
    new SuccessResponse({
      message: 'Update Product success!',
      metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  publishProductByShop = async(req, res, next) => {
    new SuccessResponse({
      message: 'Publish Product success!',
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  unPublishProductByShop = async(req, res, next) => {
    new SuccessResponse({
      message: 'UnPublish Product success!',
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  searchProductByUser = async(req, res, next) => {
    new SuccessResponse({
      message: 'Get List search products success!',
      metadata: await ProductService.searchProduct(req.params)
    }).send(res)
  }

  findAllProducts = async(req, res, next) => {
    new SuccessResponse({
      message: 'Get List all products success!',
      metadata: await ProductService.findAllProducts(req.query)
    }).send(res)
  }

  findProduct = async(req, res, next) => {
    new SuccessResponse({
      message: 'Get List all products success!',
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id
      })
    }).send(res)
  }

  /**
   * @description Get all drafts for shop
   * @param {Number} limit 
   * @param {Number} skip 
   * @param {Number} product_shop 
   * @returns {JSON} 
   */
  findAllDraftsForShop = async(req, res, next) => {
    new SuccessResponse({
      message: 'Get list draft Product success!',
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  findAllPublishedForShop = async(req, res, next) => {
    new SuccessResponse({
      message: 'Get list published Product success!',
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

}

module.exports = new ProductController();
