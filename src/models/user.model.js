"use strict";

//!dmbg
const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

// Declare the Schema of the Mongo model
const userSchema = new Schema({
  usr_id: {
    type: Number,
    required: true,
  },
  usr_email: {
    type: String,
    required: true,
  },
  usr_slug: {
    type: String, // virtual id
    required: true,
  },
  usr_password: {
    type: String,
    default: '',
  },
  usr_name: {
    type: String,
    default: '',
  },
  usr_salf: {
    type: String,
    default: '',
  },
  usr_phone: {
    type: String,
    default: '',
  },
  usr_sex: {
    type: String,
    default: '',
  },
  usr_avatar: {
    type: String,
    default: '',
  },
  usr_date_of_birth: {
    type: String,
    default: '',
  },
  usr_role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
  },
  usr_status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'active', 'block']
  },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = {
    user: model(DOCUMENT_NAME, userSchema)
};
