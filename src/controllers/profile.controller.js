'use strict'

const { SuccessResponse } = require("../core/success.response");

const {  } = require("../services/profile.service");

class ProfileController {
    // ADMIN
    profiles = async (req, res, next) => {
        new SuccessResponse({
            message: 'View All Profile',
            metadata: await createProfile(req.body)
        }).send(res)
    }

    // SHOP
    profile = async (req, res, next) => {
        new SuccessResponse({
            message: 'View All Profile',
            metadata: await createProfile(req.body)
        }).send(res)
    }
}


module.exports = new ProfileController()
