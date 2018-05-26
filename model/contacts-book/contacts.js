'use strict';

const DbDefinitions = require('../dbDefinitions');
const ContactsTable = require('../../config/tables/contacts-book/contacts');

const DbSlave = DbDefinitions.dbContactsMaster;
const DbMaster = DbDefinitions.dbContactsSlave;

let tableOptions = {
    table: ContactsTable,
    db: {
        dbSlave: DbSlave,
        dbMaster: DbMaster
    }
};

module.exports = new (require('../base-model'))(tableOptions);
