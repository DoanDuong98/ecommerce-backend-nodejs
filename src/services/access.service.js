'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadReqestError, UnauthorizedError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
};

class AccessService {

  static logout = async(keysStore) => {
    const delKey = await KeyTokenService.removekeyById(keysStore._id);
    return delKey;
  }

  static handleRefreshToken = async ({ refreshToken, user, keysStore }) => {
    const { userId, email } = user;
    if (keysStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError('Something wrong! plz login');
    }

    if (keysStore.refreshToken !== refreshToken) throw new UnauthorizedError('SHop not register!');
    const shop = await findByEmail({ email });
    if (!shop) throw new UnauthorizedError('SHop not register!');

    // create new tokens
    const tokens = await createTokenPair({ userId: shop._id, email }, holderToken.publicKey , holderToken.privateKey);
    
    // update token
    await keysStore.update({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })
    return {
      user,
      tokens
    }
  }

  static login = async({ email, password, refreshToken = null }) => {
    const shop = await findByEmail({ email });
    if (!shop) throw new BadReqestError('Shop not found!');
    const match = bcrypt.compare(password, shop.password);
    if (!match) throw new UnauthorizedError('Authentication error!');

    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    const tokens = await createTokenPair({ userId: shop._id, email }, publicKey , privateKey);

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey, publicKey,
      userId: shop._id
    })

    return {
      code: 201,
      metadata: {
        shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: shop }),
        tokens
      }
    }
  }

  static signUp = async ({ name, email, password }) => {
    try {
      const hodelShop = await shopModel.findOne({ email }).lean();
      if (hodelShop) throw new BadReqestError('Error: Shop registered!');
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name, email, password: passwordHash, roles: [RoleShop.SHOP]
      });

      if (newShop) {
        // created privateKey, publicKey
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //   modulusLength: 4096,
        //   publicKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   },
        //   privateKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   },
        // });

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        const keysStore = await KeyTokenService.createKeyToken({ userId: newShop._id, publicKey, privateKey });

        if (!keysStore) {
          return {
            code: '',
            message: 'keysStore error',
          }
        }

        // create token pair
        const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey , privateKey);
        return {
          code: 201,
          metadata: {
            shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
            tokens
          }
        }
      } 
      return {
        code: 200,
        metadata: null
      }

    } catch(err) {
      return {
        code: '',
        message: err.message,
        status: 'error'
      }
    }
  }
}

module.exports = AccessService;

