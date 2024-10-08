'use strict'

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    // new SuccessResponse({
    //   message: 'Get token success!',
    //   metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    // }).send(res)

    //V2
    new SuccessResponse({
      message: 'Get token success!',
      metadata: await AccessService.handleRefreshToken({
        refresToken: req.refresToken,
        user: req.user,
        keyStore: req.keyStore
      }),
    }).send(res)
  }

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res)
  }

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: 'Success!',
      metadata: await AccessService.logout(req.keyStore),
    }).send(res)
  }

  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Register OK!',
      metadata: await AccessService.signUp(req.body),
      // options: {
      //   limit: 10
      // }
    }).send(res)
  }
}

module.exports = new AccessController();
