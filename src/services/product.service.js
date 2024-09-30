'use strict'

const { product, clothing, electronic, furniture } = require("../models/product.model");
const { BadReqestError } = require("../core/error.response");
const { findAllDraftsForShop, publishProductByShop, findAllPublishedForShop, unPublishProductByShop, searchProductByUser, findAllProducts, findProduct, updateProductById } = require("../models/repositories/product.repo");
const { removeNullValueObj, updateNestedObject } = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { pushNotiToSystem } = require("./notification.service");

// define Factory
class ProductFactory {

  static productRegistry = {} // key-class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadReqestError('Invalid Product type' + type);
    return new productClass(payload).createProduct()
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadReqestError('Invalid Product type' + type);
    return new productClass(payload).updateProduct(productId)
  }

  // QUERY //
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip })
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishedForShop({ query, limit, skip })
  }
  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch })
  }

  static async findAllProducts({ limit= 50, sort= 'ctime', page = 1, filter = { isPublished: true } }) {
    return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb'] })
  }
  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v'] })
  }
  // END QUERY //

  // PUT //
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  // END PUT //
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity,
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
    this.product_quantity = product_quantity
  }

  // create new product
  async createProduct( product_id ) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.query
      })
      // Push noti to system
      pushNotiToSystem({
        type: 'SHOP-001',
        receivedId: 1,
        senderId: 1,
        options: {}
      })
    }
    return newProduct;
  }

  // update product
  async updateProduct( productId, body ) {
    return await updateProductById({ productId, body, model: product });
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) throw new BadReqestError("Create new Clothing error");

    const newProduct = await super.createProduct()
    if (!newProduct) throw new BadReqestError("Create new Product error");

    return newProduct
  }

  async updateProduct(productId) {
    const objParams = removeNullValueObj(this);
    if (objParams.product_attributes) {
      await updateProductById({ productId, body: updateNestedObject(objParams.product_attributes), model: clothing });
    }
    const updateProduct = await super.updateProduct(productId, updateNestedObject(objParams.product_attributes));
    return updateProduct;
  }
}

// Define sub-class for different product types Electronics
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newElectronic) throw new BadReqestError("Create new Electronic error");
    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadReqestError("Create new Product error");

    return newProduct
  }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    });
    if (!newFurniture) throw new BadReqestError("Create new Furniture error");
    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw new BadReqestError("Create new Product error");

    return newProduct
  }
}

// register product type
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory
