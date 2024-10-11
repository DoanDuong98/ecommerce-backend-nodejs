'use strict'

const resourceModel = require("../models/resource.model");
const roleModel = require("../models/role.model");

/**
 * Description placeholder
 *
 * @param {string} name
 * @param {string} slug
 * @param {string} description
 * @returns {*}
 */
const createResource = async ({ name = 'profile', slug = 'p0001', description = '' }) => {
    try {
        // check name or slug
        // new src
        const resource = await resourceModel.create({
            src_name: name,
            src_slug: slug,
            src_description: description
        });

        return resource;
    } catch (error) {
        return error;
    }
}


/**
 * Description placeholder
 *
 * @async
 * @returns {*}
 */
const resourceList = async ({ userId, limit = 30, offset = 0, search = '' }) => {
    try {
        // check admin, middleware
        const resources = await resourceModel.aggregate([
            {
                $project: {
                    _id: 0,
                    name: '$src_name',
                    slug: '$src_slug',
                    description: '$src_description',
                    resourceId: '$_id',
                    createdAt: 1
                }
            }
        ])
        return resources
    } catch (error) {
        return error        
    }
}

const createRole = async ({ name = 'shop', slug = 's0001', description = '', grants = [] }) => {
    try {
        // check exit
        // new role
        const role = roleModel.create({
            role_name: name,
            role_slug: slug,
            role_description: description,
            role_grants: grants
        })
        return role;
    } catch (error) {
        return error
    }
}

const roleList = async ({userId, limit = 30, offset = 0, search = ''}) => {
    try {
        // check admin

        // list role
        const roles = await roleModel.aggregate([
            {
                $unwind: '$role_grants'
            },
            {
                $lookup: {
                    from: 'Resource',
                    localField: 'role_grants.resource',
                    foreignField: '_id',
                    as: 'resource'
                }
            },
            {
                $unwind: 'resource'
            },
            {
                $project: {
                    role: '$role_name',
                    resource: '$resource.src_name',
                    action: '$role_grants.actions',
                    attributes: '$role_grants.attributes'
                }
            },
            {
                $unwind: '$action'
            },
            {
                $project: {
                    role: 1,
                    resource: 1,
                    action: '$action',
                    attributes: 1,
                    _id: 0
                }
            }
        ])
        return roles;
    } catch (error) {
        
    }
}

module.exports = {
    createResource,
    resourceList,
    createRole,
    roleList
}
