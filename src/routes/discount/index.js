'use strict'

const express = require("express")
const discountController = require("../../controllers/discount.controller");
const { asyncHandle } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router()

// authentication
router.use(authenticationV2)
/////////////////////////
router.post('', asyncHandle(discountController.createDiscountCode));
router.get('/amount', asyncHandle(discountController.getDiscountAmount));

module.exports = router;
