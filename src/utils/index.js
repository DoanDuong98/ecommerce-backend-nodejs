'use strict'

const _ = require("lodash");
const { Types } = require("mongoose");

const convertToObjectId = (id) => Types.ObjectId(id);

const getInfoData = ({ fileds = [], object = [] }) => {
  return _.pick(object, fileds);
}

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}

const removeNullValueObj = (obj) => {
  Object.keys(obj).forEach(k => {
    if(obj[k] == null) delete obj[k];
  });
  return obj;
}

const updateNestedObject = (obj) => {
  const final = {};
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const response = updateNestedObject(obj[k]);
      Object.keys(response).forEach(a => {
        final[`${k}.${a}`] = response[a];
      })
    } else {
      final[k] = obj[k]
    }
  })
  return final;
}

module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeNullValueObj,
  updateNestedObject,
  convertToObjectId
}

