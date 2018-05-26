'use strict';

const dbContactsMasterConfigs = {
    development: {
        host: 'localhost',
        port: 3306,
        user: 'ContactsMaster',
        password: 'contactsDbAbBw1308',
        database: 'contacts',
        min: 2,
        max: 10
    },

    production: {
        host: 'localhost',
        port: 3306,
        user: 'ContactsMaster',
        password: 'contactsDbAbBw1308#Software()!',
        database: 'contacts',
        min: 2,
        max: 10
    }
};

const dbContactsMaster = dbContactsMasterConfigs[process.env.ENV || 'development'];

module.exports = require('rc')('dbContactsMaster', dbContactsMaster);
