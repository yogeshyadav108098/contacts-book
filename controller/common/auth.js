'use strict';

// 3rd Party
const Q = require('q');
const Compare = require('tsscmp'); // For timing safe compare
const Auth = require('basic-auth');

// Internal
const Logger = require('../../lib/logger');
const Response = new (require('./response'))();
const AuthConfig = require('../../config/auth');
const ResponseCodes = require('../../constants/response-codes');

const filePrefix = 'Controller: BasicAuth:';
class Readme {
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

    authorize(req, res, next) {
        let credentials = Auth(req);
        if (!credentials || !validateCredentials(credentials.name, credentials.pass)) {
            return Response.sendFailure(next, ResponseCodes.USER_UNAUTHORIZED);
        }

        return next();
    }
};

const validateCredentials = (username, password) => {
    let valid = true;

    valid = Compare(username, AuthConfig.USERNAME) && valid;
    valid = Compare(password, AuthConfig.PASSWORD) && valid;
    return valid;
};

module.exports = Readme;
