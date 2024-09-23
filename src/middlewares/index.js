'use strict'

const Logger = require('../logger/discord.log.v2');

const pushToLogDiscord = async (req, res, next) => {
    try {
        Logger.sendToFormartCode({
            title: `Method:: ${req.method}`,
            code: req.method === 'GET' ? req.query : req.body,
            message: `${req.get('host')} ${req.originnalUrl}`
        });
        return next();
    } catch(err) {
        next(err);
    }
}

module.exports = {
    pushToLogDiscord
}
