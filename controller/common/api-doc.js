'use strict';

// 3rd Party
const Q = require('q');
const Path = require('path');
const Exec = require('child_process').exec;

// Internal
const Logger = require('../../lib/logger');

const filePrefix = 'Controller: ApiDoc:';
class ApiDoc {
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

    runApiDoc(req, res, next) {
        new Q()
            .then(() => {
                return checkIfApiDocFolderExists();
            })
            .then((ifExists) => {
                if (ifExists) {
                    return Q.resolve();
                }

                return generateApiDocs();
            })
            .then(() => {
                return next();
            })
            .fail((error) => {
                return next(error);
            });
    }

    renderApiDoc(req, res, next) {
        let indexFilePath = Path.join(__dirname, '../../apiDocs/index.html');
        return res.sendFile(indexFilePath);
    }
}

const checkIfApiDocFolderExists = () => {
    let deferred = Q.defer();

    Exec('ls -la | grep apiDocs', (error, stdout, stderr) => {
        if (!error) {
            // ApiDocs folder exist, can ignore regeneration of apidoc
            Logger.info('ApiDocs folder exist, can ignore regeneration');
            return deferred.resolve(true);
        }

        return deferred.resolve(false);
    });
    return deferred.promise;
};

const generateApiDocs = () => {
    let deferred = Q.defer();

    Exec('apidoc -i routes/ -o apiDocs/', (error, stdout, stderr) => {
        if (error) {
            return deferred.reject(error);
        }
        return deferred.resolve();
    });
    return deferred.promise;
};


module.exports = ApiDoc;
