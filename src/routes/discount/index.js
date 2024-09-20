'use strict'

const express = require("express")
const discountController = require("../../controllers/discount.controller");
const { asyncHandle } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router()

router.post('/amount', asyncHandle(discountController.getDiscountAmount));
router.get('/list_product_code', asyncHandle(discountController.getAllDiscountWithProduct));

// authentication

router.use(authenticationV2)
/////////////////////////
router.post('', asyncHandle(discountController.createDiscountCode))
router.get('', asyncHandle(discountController.getAllDiscountByShop))

module.exports = router;
