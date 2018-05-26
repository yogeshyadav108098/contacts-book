'use strict';

const Util = require('util');
const Mysequel = require('./mysequel');

function configure(config) {
    let dbConfig = {
        url: Util.format(
            'mysql://%s:%s@%s:%s/%s',
            encodeURIComponent(config.user),
            encodeURIComponent(config.password),
            config.host,
            config.port || 3306,
            config.database
        ),
        connections: {
            min: config.min,
            max: config.max
        },
        queueLimit: config.queueLimit || 50000,
        timeout: config.timeout
    };

    let db = Mysequel(dbConfig);

    return db;
}

module.exports = configure;
