'use strict';

// Internal
const Q = require('q');
const Base = require('../base');
const Logger = require('../../lib/logger');
const ContactsApi = require('../../api/contacts-book/contacts');

const controllerOptions = {
    table: 'Contacts',
    api: ContactsApi
};
const filePrefix = 'Controller: Contacts:';

class Contacts extends Base {
    constructor(options, parentController) {
        let functionPrefix = 'Constructor:';
        Logger.info(filePrefix, functionPrefix, 'Constructing...');
        super(controllerOptions);
        Logger.info(filePrefix, functionPrefix, 'Constructed');
    }

    init(options) {
        let functionPrefix = 'Init:';
        Logger.info(filePrefix, functionPrefix, 'Initiating...');
        Logger.info(filePrefix, functionPrefix, 'Initiated');
        return Q.resolve();
    }
};

module.exports = Contacts;
