'use strict';

const Logger = new (require('uuid-logger'))();

// Add console transport
Logger.addTransport({
    console: {
        name: 'Console Logger',
        level: 'info',
        json: false,
        colorize: true
    }
});

module.exports = Logger.getLogger();
