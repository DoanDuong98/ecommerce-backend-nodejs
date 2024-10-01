"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "notifications";

// ORDER-001: order successfully
// ORDER-002: order faild
// PROMOTION-001: new PROMOTION
// SHOP-001: new product by user following

const notificationSchema = new Schema(
  {
    noti_type: {
        type: String,
        enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'],
        require: true
    },
    noti_senderId: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Shop'
    },
    noti_receiveId: {
        type: Number,
        require: true,
    },
    noti_content: {
        type: String,
        require: true
    },
    noti_options: {
        type: Object,
        default: {}
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, notificationSchema);
