"use strict";

//!dmbg
const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "roles";

const grantList = [
    { role: 'admin', resource: 'profile', action: 'update:any', attributes: '*' },
    { role: 'user', resource: 'profile', action: 'update:own', attributes: '*, !mount' },
]

// Declare the Schema of the Mongo model
const roleSchema = new Schema({
  role_name: {
    type: String,
    default: 'user',
    enum: ['user', 'shop', 'admin']
  },
  role_slug: {
    type: String,
    required: true,
  },
  role_grants: [
    {
        resource: { type: Schema.Types.ObjectId, ref: 'Resource', require: true },
        actions: [{ type: String, required: true }],
        attributes: { type: String, default: "*" }
    }
  ],
  role_status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'active', 'block']
  },
  role_description: {
    type: String,
    default: ''
  },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, roleSchema);
