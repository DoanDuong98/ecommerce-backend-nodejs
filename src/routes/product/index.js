'use strict'

const express = require("express")
const productController = require("../../controllers/product.controller");
const { asyncHandle } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.get('/search/:keySearch', asyncHandle(productController.searchProductByUser));
router.get('/:product_id', asyncHandle(productController.findProduct));
router.get('', asyncHandle(productController.findAllProducts));


// authentication
router.use(authenticationV2)
/////////////////////////
router.post('/create', asyncHandle(productController.createProduct));
router.patch('/:productId', asyncHandle(productController.updateProduct));
router.post('/publish/:id', asyncHandle(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandle(productController.unPublishProductByShop));

// QUERY //
router.get('/drafts/all', asyncHandle(productController.findAllDraftsForShop));
router.get('/published/all', asyncHandle(productController.findAllPublishedForShop));

module.exports = router;
