'use strict'

const express = require("express")
const inventoryController = require("../../controllers/inventory.controller");
const { asyncHandle } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router()

// authentication

router.use(authenticationV2)
/////////////////////////
router.post('/review', asyncHandle(inventoryController.addStockToInventory))

module.exports = router;
