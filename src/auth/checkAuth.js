'use strict'

const { findById } = require("../services/apikey.service");

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization'
}

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: 'Forbiden Error'
      })
    }
    // check obj key
    const obj  = await findById(key);
    if (!obj) {
      return res.status(403).json({
        message: 'Forbiden Error'
      })
    }

    req.objKey = obj;
    return next();
  } catch (error) {
    
  }
}

const permissions = permission => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'Permission deny'
      })
    }
    const validPermissions = req.objKey.permissions.includes(permission);
    if (!validPermissions) {
      return res.status(403).json({
        message: 'Permission deny'
      })
    }
    return next();
  }
}

const asyncHandle = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

module.exports = {
  apiKey,
  permissions,
  asyncHandle
}
