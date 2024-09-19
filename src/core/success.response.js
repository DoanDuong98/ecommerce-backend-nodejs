'use strict'

const STATUS_CODE = {
  OK: 200,
  CREATED: 201
}

const MESSAGE_CODE = {
  OK: 'OK',
  CREATED: 'CREATED'
}

class SuccessResponse {
  constructor({ message, statusCode = STATUS_CODE.OK, reasonStatusCode = MESSAGE_CODE.OK, metadata = {} }) {
    this.status = statusCode
    this.message = message || reasonStatusCode
    this.metadata = metadata
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this)
  }
}


class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata })
  }
}

class CREATED extends SuccessResponse {
  constructor({ message, statusCode = STATUS_CODE.CREATED, reasonStatusCode = MESSAGE_CODE.CREATED, metadata }) {
    super({ message, metadata, statusCode, reasonStatusCode })
  }
}

module.exports = {
  OK, CREATED, SuccessResponse
}
