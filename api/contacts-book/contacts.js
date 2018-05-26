'use strict';

// Internal
const Base = require('../base');
const ContactsModel = require('../../model/contacts-book/contacts');
const ContactsTable = require('../../config/tables/contacts-book/contacts');

const filePrefix = 'Api: Contacts:';
const contactsApiOptions = {
    model: ContactsModel,
    filters: ContactsTable.FILTERS,
    columns: ContactsTable.COLUMNS,
    commonName: ContactsTable.COMMON_NAME,
    updatableColumns: ContactsTable.UPDATABLE_COLUMNS,
    restrictedColumns: ContactsTable.RESTRICTED_COLUMNS,
    patternMatchColumns: ContactsTable.PATTERN_MATCH_COLUMNS
};


class Contacts extends Base {
    constructor(options, controller) {
        let functionPrefix = 'Constructor:';
        Logger.info(filePrefix, functionPrefix, 'Constructing...');
        super(contactsApiOptions);
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
