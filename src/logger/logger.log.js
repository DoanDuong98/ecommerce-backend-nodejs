'use strict'
const { createLogger, transports, format } = require("winston");
require("winston-daily-rotate-file")
const { v4: uuidV4 } = require("uuid")
class Logger {
    constructor() {
        const formatPrint = format.printf((level, message, context, requestId, timestamp, metadata ) => {
            return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`
        })

        this.logger = createLogger({
            level: process.env.LOG_LEVEL || 'debug',
            format: format.combine(
                format.timestamp({
                    format: 'YYYY-MM-DD hh:mm:ss.SSS A'
                }),
                formatPrint
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    level: 'info',
                    filename: 'application-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true, // true: backup log zip
                    maxSize: '20m', // dung luong file log
                    maxFiles: '14d', // xoa log trong 14 days
                    format: format.combine(
                        format.timestamp({
                            format: 'YYYY-MM-DD hh:mm:ss.SSS A'
                        }),
                        formatPrint
                    ),
                    level: 'info'
                }),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    level: 'info',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true, // true: backup log zip
                    maxSize: '20m', // dung luong file log
                    maxFiles: '14d', // xoa log trong 14 days
                    format: format.combine(
                        format.timestamp({
                            format: 'YYYY-MM-DD hh:mm:ss.SSS A'
                        }),
                        formatPrint
                    ),
                    level: 'error'
                }),
            ]
        })


    }

    commomParams(params) {
        let context, req, metadata;
        // context: router
        // req: body, params,
        // metadata
        if (!Array.isArray(params)) {
            context = params
        } else {
            [context, req, metadata] = params;
        }
        const requestId = req?.requestId || uuidV4();
        return {
            requestId,
            context,
            metadata
        }
    }

    log(message, params) {
        const paramsLog = this.commomParams(params);
        const logObject = Object.assign({message}, paramsLog);
        this.logger.info(logObject);
    }
}

module.exports = Logger;
