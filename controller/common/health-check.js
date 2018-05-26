'use strict';

const Q = require('q');
const _ = require('lodash');

const Logger = require('../../lib/logger');
const ResponseCodes = require('../../constants/response-codes');

const filePrefix = 'Controller: HealthCheck:';
class HealthCheck {
    constructor(options, parentController) {
        let functionPrefix = 'Constructor:';
        Logger.info(filePrefix, functionPrefix, 'Constructing...');
        Logger.info(filePrefix, functionPrefix, 'Constructed');
    }

    init(options) {
        let functionPrefix = 'Init:';
        Logger.info(filePrefix, functionPrefix, 'Initiating...');
        Logger.info(filePrefix, functionPrefix, 'Initiated');
        return Q.resolve();
    }

    healthCheck(req, res, next) {
        let responseMessage = {
            result: 'OK'
        };

        _.set(req, 'lastMiddlewareResponse', {
            status: ResponseCodes.OK.status,
            respToSend: responseMessage
        });

        Logger.info('HealthCheck completed: Working fine');
        return next();
    }
}
module.exports = HealthCheck;
