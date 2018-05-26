'use strict';

const ContactsModel = require('../../model/contacts-book/contacts');
const ContactsTable = require('../../config/tables/contacts-book/contacts');


module.exports = {
    basic: new (require('../base'))({
        filters: ContactsTable.FILTERS,
        columns: ContactsTable.COLUMNS,
        updatableColumns: ContactsTable.UPDATABLE_COLUMNS,
        restrictedColumns: ContactsTable.RESTRICTED_COLUMNS,
        patternMatchColumns: ContactsTable.PATTERN_MATCH_COLUMNS,
        model: ContactsModel,
        commonName: ContactsTable.COMMON_NAME
    }),
    custom: {
    }
};

