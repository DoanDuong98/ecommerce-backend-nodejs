'use strict'

const { ReasonPhrases, StatusCodes } = require('../utils/httpStatusCode');

const STATUS_CODE = {
  FORBIDEN: 403,
  CONFLICT: 409
}

const MESSAGE_CODE = {
  FORBIDEN: 'BAD REQUEST',
  CONFLICT: 'CONFLICT ERROR'
}

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

class ConflictReqestError extends ErrorResponse {
  constructor(message = MESSAGE_CODE.CONFLICT, statusCode = STATUS_CODE.FORBIDEN) {
    super(message, statusCode)
  }
}

class BadReqestError extends ErrorResponse {
  constructor(message = MESSAGE_CODE.CONFLICT, statusCode = STATUS_CODE.FORBIDEN) {
    super(message, statusCode)
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
    super(message, statusCode)
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
    super(message, statusCode)
  }
}

module.exports = {
  ConflictReqestError,
  BadReqestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError
}
