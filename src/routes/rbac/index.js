'use strict'

const express = require("express")
const rbacController = require("../../controllers/rbac.controller");
const { asyncHandle } = require("../../auth/checkAuth");
const router = express.Router();

router.post('/role', asyncHandle(rbacController.newRole));
router.get('/roles', asyncHandle(rbacController.listRole));
router.post('/resource', asyncHandle(rbacController.newResource));
router.get('/resources', asyncHandle(rbacController.listResource));

module.exports = router;
