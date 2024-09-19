"use strict";

//!dmbg
const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "shops";

// Declare the Schema of the Mongo model
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  password: {
    type: String,
    required: true,
  },
  verify: {
    type: Schema.Types.Boolean,
    default: true,
  },
  role: {
    type: Array,
    default: [],
  }, 
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);
