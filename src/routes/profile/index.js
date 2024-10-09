'use strict'

const express = require("express")
const { asyncHandle } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const { profiles, profile } = require("../../controllers/profile.controller");
const { grantAccess } = require("../../middlewares/rbac");
const router = express.Router()

// authentication

router.use(authenticationV2)
/////////////////////////

// ADMIN: ALL
router.get('/viewAny', grantAccess('readAny', 'profile'), asyncHandle(profiles))

// SHOP: OWN
router.get('/viewOwn', grantAccess('readOwn', 'profile'), asyncHandle(profile))

module.exports = router;
