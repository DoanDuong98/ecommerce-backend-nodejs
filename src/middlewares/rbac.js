'use strict'

const rbac = require('./role.middleware')

const grantAccess = (action, resource) => {
    return async(req, res, next) => {
        try {
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
