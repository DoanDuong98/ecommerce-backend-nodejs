'use strict'

const express = require("express")
const accessController = require("../../controllers/access.controller");
const { asyncHandle } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

router.post('/shop/signup', asyncHandle(accessController.signUp));
router.post('/shop/login', asyncHandle(accessController.login));

// authentication
router.use(authenticationV2)
/////////////////////////
router.post('/shop/logout', asyncHandle(accessController.logout));
router.post('/shop/handleRefreshToken', asyncHandle(accessController.handleRefreshToken));


module.exports = router;
