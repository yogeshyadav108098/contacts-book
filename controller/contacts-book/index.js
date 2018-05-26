'use strict';

// 3rd Party
const Q = require('q');

// Internal
const Contacts = require('./contacts');
const Logger = require('../../lib/logger');

const filePrefix = 'Controller: Contacts-Book:';
class ContactsBook {
    constructor(options, parentController) {
        let self = this;
        let functionPrefix = 'Constructor:';
        Logger.info(filePrefix, functionPrefix, 'Constructing...');

        self.contacts = new Contacts(options, self);

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
                return self.contacts.init();
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

module.exports = ContactsBook;
