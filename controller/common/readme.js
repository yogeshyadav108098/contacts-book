'use strict';

const Q = require('q');
const _ = require('lodash');
const Exec = require('child_process').exec;
const Logger = require('../../lib/logger');
const ResponseCodes = require('../../constants/response-codes');

const filePrefix = 'Controller: Readme:';
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

    runReadme(req, res, next) {
        new Q()
            .then(() => {
                return generateReadMe();
            })
            .then(() => {
                let responseMessage = {
                    result: 'ReadMe file generated'
                };

                _.set(req, 'lastMiddlewareResponse', {
                    status: ResponseCodes.OK.status,
                    respToSend: responseMessage
                });

                return next();
            })
            .fail((error) => {
                return next(error);
            });
    }
}

const generateReadMe = () => {
    let deferred = Q.defer();
    Exec('apidoc-markdown -p apiDocs/ -o readme.md', (error, stdout, stderr) => {
        if (error) {
            return deferred.reject(error);
        }

        Logger.info('ReadMe file generated successfully');
        return deferred.resolve();
    });
    return deferred.promise;
};

module.exports = Readme;
