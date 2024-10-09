'use strict'

const { SuccessResponse } = require("../core/success.response")
const { createRole, createResource, resourceList, roleList } = require("../services/rbac.service")

/**
 * @description create a new role
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const newResource = async(req, res, next) => {
    new SuccessResponse({
        message: "create OK",
        metadata: await createResource(req.body)
    }).send(res)
}

const newRole = async(req, res, next) => {
    new SuccessResponse({
        message: "create OK",
        metadata: await createRole(req.body)
    }).send(res)
}

const listRole = async(req, res, next) => {
    new SuccessResponse({
        message: "GET OK",
        metadata: await roleList(req.body)
    }).send(res)
}

const listResource = async(req, res, next) => {
    new SuccessResponse({
        message: "GET OK",
        metadata: await resourceList(req.body)
    }).send(res)
}


module.exports = {
    newRole,
    newResource,
    listResource,
    listRole
}

