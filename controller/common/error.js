'use strict';

const Q = require('q');

const Logger = require('../../lib/logger');
const ResponseCodes = require('../../constants/response-codes');

const filePrefix = 'Controller: Error:';
class Error {
    constructor(options, controller) {
        let functionPrefix = 'Constructor:';
        Logger.info(filePrefix, functionPrefix, 'Constructing...');
        Logger.info(filePrefix, functionPrefix, 'Constructed');
    }

    init(options) {
        let functionPrefix = 'Init:';
        Logger.debug(filePrefix, functionPrefix, 'Initiating...');
        Logger.debug(filePrefix, functionPrefix, 'Initiated');
        return Q.resolve();
    }

    handleError(error, req, res, next) {
        let status = error.status || ResponseCodes.INTERNAL_SERVER_ERROR.status;

        let response = {
            message: error.message || error,
            stack: error.stack ? error.stack.split('\n') : '',
            code: error.code
        };

        if (process.env.ENV.toLowerCase() === 'production') {
            response.stack = undefined;
        }

        Logger.info(req.method, req.url, status, req.ip);
        return res.status(status).json(response);
    }
}

module.exports = Error;
