'use strict';

const dbContactsSlaveConfigs = {
    development: {
        host: 'localhost',
        port: 3306,
        user: 'ContactsSlave',
        password: 'contactsDbAbBw1308',
        database: 'contacts',
        min: 2,
        max: 10
    },

    production: {
        host: 'localhost',
        port: 3306,
        user: 'ContactsSlave',
        password: 'contactsDbAbBw1308#Software()!',
        database: 'contacts',
        min: 2,
        max: 10
    }
};

const dbContactsSlave = dbContactsSlaveConfigs[process.env.ENV || 'development'];

module.exports = require('rc')('dbContactsSlave', dbContactsSlave);
