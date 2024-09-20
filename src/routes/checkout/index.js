'use strict'

const express = require("express")
const checkoutController = require("../../controllers/checkout.controller");
const { asyncHandle } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router()

// authentication

router.use(authenticationV2)
/////////////////////////
router.post('/review', asyncHandle(checkoutController.checkoutReview))

module.exports = router;
