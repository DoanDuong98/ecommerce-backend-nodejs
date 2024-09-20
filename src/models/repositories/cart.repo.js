"use strict";

const { convertToObjectId } = require("../../utils");
const { cart } = require("../cart.model");

const findCartById = async (id) => {
  return await cart
    .findOne({ _id: convertToObjectId(id), cart_state: "active" })
    .lean();
};

module.exports = {
  findCartById,
};
