'use strict'

const { NotFoundError } = require("../core/error.response");
const commentModel = require("../models/comment.model");
const { findProductById } = require("../models/repositories/product.repo");
const { convertToObjectId } = require("../utils");

class CommnetService {

    // add comment
    static async createComment({ productId, userId, content, parentId = null }) {
        const newComment = new commentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentId
        })
        let rightValue;
        if (parentId) {
            // reply comment
            const parentComment = await commentModel.findById(parentId);
            if (!parentComment) throw NotFoundError('Comment not found');
            rightValue = parentComment.comment_right;

            // update Many
            await commentModel.updateMany({
                comment_parentId: convertToObjectId(productId),
                comment_left: { $gte: rightValue }
            }, {
                $inc: {comment_left: 2}
            })

            await commentModel.updateMany({
                comment_parentId: convertToObjectId(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: {comment_right: 2}
            })
        } else {
            const maxRightValue = await commentModel.findOne({
                comment_productId: convertToObjectId(productId)
            }, 'comment_right', { sort: { comment_right: -1 } });
            if (maxRightValue) {
                rightValue = maxRightValue + 1;
            } else rightValue = 1;
        }

        // Insert comment
        newComment.comment_left = rightValue;
        newComment.comment_right = rightValue + 1;
        await newComment.save();
        return newComment;
    }

    static async getCommentByParentId({ productId, parentCommentId = null, limit = 50, offset = 0 }) {
        if (parentCommentId) {
            const parent = await commentModel.findById(parentCommentId);
            if (!parent) throw new NotFoundError('comment not found')

            const comments = await commentModel.find({
                comment_productId: convertToObjectId(productId),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lt: parent.comment_right }
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_leftL: 1
            });
            return comments;
        }
        
        const comments = await commentModel.find({
            comment_productId: convertToObjectId(productId),
            comment_parentId: null
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({
            comment_leftL: 1
        });
        return comments;
    }

    static async deleteComment({ commentId, productId }) {
        // check product exists
        const foundProduct = await findProductById(productId);
        if (!foundProduct) throw new NotFoundError('Product not found');


        // Cal left right parrent comment
        const comment = await commentModel.findById(commentId);
        if (!comment) throw new NotFoundError('comment not found');

        const leftVal = comment.comment_left;
        const rightVal = comment.comment_right;

        const width = rightVal - leftVal + 1;
        // delete child conmment
        await commentModel.deleteMany({
            comment_productId: productId,
            comment_left: { $gte: leftVal, $lte: rightVal }
        });

        //
        await commentModel.updateMany({
            comment_productId: convertToObjectId(productId),
            comment_right: { $gt: rightVal }
            
        }, {
            $inc: { comment_right: - width }
        })

        await commentModel.updateMany({
            comment_productId: convertToObjectId(productId),
            comment_left: { $gt: rightVal }
            
        }, {
            $inc: { comment_left: - width }
        })

        return true;
    }
}

module.exports = CommnetService;
