'use strict';

// 3rd Party
const Q = require('q');

// Internal
const Common = require('./common');
const Logger = require('../lib/logger');

const filePrefix = 'Controller: Main:';
class Controller {
    constructor(options) {
        let self = this;
        let functionPrefix = 'Constructor:';
        Logger.info(filePrefix, functionPrefix, 'Constructing...');

        self.common = new Common(options, self);

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
                Logger.info(filePrefix, functionPrefix, 'Initiated');
                return deferred.resolve();
            })
            .fail((error) => {
                return deferred.reject(error);
            });
        return deferred.promise;
    }
}

module.exports = Controller;
