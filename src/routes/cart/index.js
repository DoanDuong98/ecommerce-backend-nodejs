'use strict'

const express = require("express")
const cartController = require("../../controllers/cart.controller");
const { asyncHandle } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router()

// authentication

router.use(authenticationV2)
/////////////////////////
router.post('', asyncHandle(cartController.addToCart))
router.delete('', asyncHandle(cartController.delete))
router.get('', asyncHandle(cartController.list))
router.post('/update', asyncHandle(cartController.update))

module.exports = router;
