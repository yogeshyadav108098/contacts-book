'use strict';

// 3rd Party
const Q = require('q');

// Internal
const Error = require('./error');
const ApiDoc = require('./api-doc');
const ReadMeGen = require('./readme');
const Response = require('./response');
const Logger = require('../../lib/logger');
const HealthCheck = require('./health-check');

const filePrefix = 'Controller: Common:';
class Common {
    constructor(options) {
        let self = this;
        let functionPrefix = 'Constructor:';
        Logger.info(filePrefix, functionPrefix, 'Constructing...');

        self.error = new Error(options, self);
        self.apiDoc = new ApiDoc(options, self);
        self.response = new Response(options, self);
        self.readMeGen = new ReadMeGen(options, self);
        self.healthCheck = new HealthCheck(options, self);

        Logger.info(filePrefix, functionPrefix, 'Constructed');
    }

    init(options) {
        let functionPrefix = 'Init:';
        let deferred = Q.defer();

        new Q(undefined)
            .then(() => {
                Logger.info(filePrefix, functionPrefix, 'Initiating...');
                return Q.resolve();
            })
            .then(() => {
                return self.ApiDoc.init();
            })
            .then(() => {
                return self.ReadMeGen.init();
            })
            .then(() => {
                return self.Response.init();
            })
            .then(() => {
                return self.HealthCheck.init();
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
