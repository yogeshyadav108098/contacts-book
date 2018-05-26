'use strict';

const _ = require('lodash');

let allDBs = {};

function defineDB(name) {
    let propName = name;

    _.set(allDBs, propName, require('./db')(require('./' + name)));
}

defineDB('dbContactsMaster');
defineDB('dbContactsSlave');

module.exports = allDBs;
