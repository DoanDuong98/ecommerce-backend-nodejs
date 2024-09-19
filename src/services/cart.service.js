'use strict'

const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const { findProductById } = require("../models/repositories/product.repo");

/*
  Cart Service
  - add product to cart
  - reduce/increase product quantity
  - get cart
  - delete cart
  - delete cart item
*/ 

class CartService {
  static async createUserCart({ userId, products }) {
    const query = { cart_userId: userId, cart_state: 'active' },
    updateOrInsert = {
      $addToSet : {
        cart_products: products
      }
    }, option = { upsert: true, new: true }
    return await cartModel.findOneAndUpdate(query, updateOrInsert, option)
  }

  static async updateUserCartQuantity({ userId, products }) {
    const { productId, quantity } = products;
    const query = {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'active'
    }, updateSet = {
      $inc : {
        'cart_products.$.quantity': quantity,
      }
    }, option = { upsert: true, new: true }
    return await cartModel.findOneAndUpdate(query, updateSet, option)
  }

  static async addToCart({ userId, products = {} }) {
    // Check cart
    const userCart = await cartModel.findOne({
      cart_userId: userId
    })
    if (!userCart) {
      // create
      return await CartService.createUserCart({ userId, products })
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [products]
      return await userCart.save()
    }

    return CartService.updateUserCartQuantity({ userId, products })
  }

  static async addToCartV2({ userId, products = {} }) {
    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];
    // check product
    const findProduct = await findProductById(productId);
    if (!findProduct) throw new NotFoundError("Product not found!")
  }
}


module.exports = CartService
