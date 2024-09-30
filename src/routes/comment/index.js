'use strict'

const express = require("express")
const commentController = require("../../controllers/comment.controller");
const { asyncHandle } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router()

// authentication

router.use(authenticationV2)
/////////////////////////
router.post('', asyncHandle(commentController.comment))
router.get('', asyncHandle(commentController.getCommentByParent))
router.delete('', asyncHandle(commentController.deleteComment))

module.exports = router;
