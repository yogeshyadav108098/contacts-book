'use strict';

// 3rd Party
const Q = require('q');

// Internal
const Auth = require('./auth');
const Error = require('./error');
const ApiDoc = require('./api-doc');
const ReadMeGen = require('./readme');
const Response = require('./response');
const Validator = require('./validator');
const Logger = require('../../lib/logger');
const HealthCheck = require('./health-check');

const filePrefix = 'Controller: Common:';
class Common {
    constructor(options, parentController) {
        let self = this;
        let functionPrefix = 'Constructor:';
        Logger.info(filePrefix, functionPrefix, 'Constructing...');

        self.auth = new Auth(options, self);
        self.error = new Error(options, self);
        self.apiDoc = new ApiDoc(options, self);
        self.response = new Response(options, self);
        self.validator = new Validator(options, self);
        self.readMeGen = new ReadMeGen(options, self);
        self.healthCheck = new HealthCheck(options, self);

        Logger.info(filePrefix, functionPrefix, 'Constructed');
    }

    init(options) {
        let self = this;
        let functionPrefix = 'Init:';
        let deferred = Q.defer();

        new Q(undefined)
            .then(() => {
                Logger.info(filePrefix, functionPrefix, 'Initiating...');
                return Q.resolve();
            })
            .then(() => {
                return self.error.init();
            })
            .then(() => {
                return self.apiDoc.init();
            })
            .then(() => {
                return self.response.init();
            })
            .then(() => {
                return self.validator.init();
            })
            .then(() => {
                return self.readMeGen.init();
            })
            .then(() => {
                return self.healthCheck.init();
            })
            .then(() => {
                Logger.info(filePrefix, functionPrefix, 'Initiated');
                return deferred.resolve();
            })
            .fail((error) => {
                return deferred.reject(error);
            });
        return deferred.promise;
    }
}

module.exports = Common;
