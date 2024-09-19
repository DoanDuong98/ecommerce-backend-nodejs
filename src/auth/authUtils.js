'use strict'

const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandle");
const { UnauthorizedError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'refreshToken'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: '2 days'
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: '7 days'
    });

    // JWT.verify(accessToken, publicKey, (err, decode) => {
    //   if (err) console.error();
    //   console.log(decode);
    // })

    return {
      accessToken, refreshToken
    }
  } catch (error) {
    
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1 - check userId
    2 - get token
    3 - verify token
    4 - check userId in bds
    5 - check keyStore
    6 - OK => next
  */ 

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new UnauthorizedError('Invalid Request');

    //2
    const keyStore = await findByUserId(userId);
    if (!userId) throw new NotFoundError('Not found keyStore');

    //3
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new UnauthorizedError('Invalid Request');

    try {
      const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
      if (userId !== decodeUser.userId) throw new UnauthorizedError('Invalid User');
      req.keyStore = keyStore;
      return next();
    } catch (error) {
      throw error
    }

})

const authenticationV2 = asyncHandler(async (req, res, next) => {
  /*
    1 - check userId
    2 - get token
    3 - verify token
    4 - check userId in bds
    5 - check keyStore
    6 - OK => next
  */ 

    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) throw new UnauthorizedError('Invalid Request');
    //2
    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Not found keyStore');
    //3
    if (req.headers[HEADER.REFRESHTOKEN]) {
      try {
        const refreshToken = req.headers[HEADER.REFRESHTOKEN];
        const decodeUser = JWT.verify(refreshToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) throw new UnauthorizedError('Invalid User');
        req.keyStore = keyStore;
        req.user = decodeUser // { userId, email }
        req.refreshToken = refreshToken
        return next();
      } catch (error) {
        throw error
      }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) throw new UnauthorizedError('Invalid Request');

    try {
      const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
      if (userId !== decodeUser.userId) throw new UnauthorizedError('Invalid User');
      req.keyStore = keyStore;
      req.user = decodeUser // { userId, email }
      return next();
    } catch (error) {
      throw error
    }

})

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
  authenticationV2
}
