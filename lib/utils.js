'use strict';

// 3rd Party

// Internals
const Logger = require('./logger');

const filePrefix = 'Lib: Utils:';
class Utils {
    constructor() {
        const functionPrefix = 'Constructor:';
        Logger.info(filePrefix, functionPrefix, 'Constructing Lib Utilities...');
        Logger.info(filePrefix, functionPrefix, 'Constructed');
    }

    bind(object, functionName) {
        const functionPrefix = 'Bind:';
        Logger.debug(filePrefix, functionPrefix, 'Funcion:', functionName);
        return object[functionName].bind(object);
    }

    genError(message, status, code) {
        let error = new Error(message || 'Unexpected error occurred, Please report');
        error.status = status ? status : 500;
        error.code = code;
        return error;
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = new Utils();
