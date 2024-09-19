'use strict'

const keytokenModel = require("../models/keytoken.model");
const { Types } = require('mongoose');

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // level 0
      // const tokens = await keytokenModel.create({
      //   publicKey,
      //   privateKey,
      //   user: userId
      // });
      // return tokens ? tokens.publicKey : null;

      // level xx
      const filter = { user: userId }, update = {
        publicKey, privateKey, refreshTokenUsed: [], refreshToken
      }, options = { upsert: true, new: true }
      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options);
 
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  }

  static findByUserId = async(userId) => {
    return await keytokenModel.findOne({ user: new Types.ObjectId(userId) })
  }

  static findByRefreshtoken = async(refreshToken) => {
    return await keytokenModel.findOne({ refreshToken })
  }

  static findByRefreshtokenUsed = async(refreshToken) => {
    return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
  }

  static removekeyById = async(id) => {
    return await keytokenModel.deleteOne({
      _id: new Types.ObjectId(id)
    })
  }

  static deleteKeyById = async(id) => {
    return await keytokenModel.deleteOne({
      user: new Types.ObjectId(id)
    })
  }
}

module.exports = KeyTokenService;
