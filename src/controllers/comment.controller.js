'use strict'

const { SuccessResponse } = require("../core/success.response");

const { createComment, getCommentByParentId, deleteComment } = require("../services/comment.service");

class CommentController {
    comment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Comment Success',
            metadata: await createComment(req.body)
        }).send(res)
    }

    getCommentByParent = async (req, res, next) => {
        new SuccessResponse({
            message: 'get Success',
            metadata: await getCommentByParentId(req.query)
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'get Success',
            metadata: await deleteComment(req.query)
        }).send(res)
    }
}


module.exports = new CommentController()
