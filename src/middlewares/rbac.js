'use strict'

const { roleList } = require('../services/rbac.service')
const rbac = require('./role.middleware')

const grantAccess = (action, resource) => {
    return async(req, res, next) => {
        try {
            rbac.setGrants(await roleList({ userId: 999 })) // fake userId, save to cache
            const role_name = req.query.role;
            const permission = rbac.can(role_name)[action][resource];
            if (!permission.granted) throw new Error('You don`t have permission to access...')
        } catch (error) {
            
        }
    }
}

module.exports = {
    grantAccess
}
