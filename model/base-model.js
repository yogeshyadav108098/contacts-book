'use strict';

const _ = require('lodash');

// Internal
const Model = require('./base');
const Enums = require('../constants/enums');

class BaseModel {
    constructor(options) {
        this._dbMaster = new Model(options, options.db.dbMaster);
        this._dbSlave = new Model(options, options.db.dbSlave);
    }

    insert(options, configrations) {
        let db = _.get(configrations, 'useDbSlave') ? this._dbSlave : this._dbMaster;
        return db.insert(options.fields ? options.fields : options);
    };

    update(options, configrations) {
        let db = _.get(configrations, 'useDbSlave') ? this._dbSlave : this._dbMaster;
        return db.update(options.fields ? options.fields : options);
    };

    list(options, configrations) {
        let db = _.get(configrations, 'useDbSlave') ? this._dbSlave : this._dbMaster;
        return db.list(options);
    };

    bulkUpdate(options, configrations) {
        let db = _.get(configrations, 'useDbSlave') ? this._dbSlave : this._dbMaster;
        return db.bulkUpdate(options);
    };

    delete(options, configrations) {
        let db = _.get(configrations, 'useDbSlave') ? this._dbSlave : this._dbMaster;

        let updateOptions = {
            fields: {
                status: Enums.status.INACTIVE
            },
            filters: {
                id: options.id
            }
        };
        return db.bulkUpdate(updateOptions);
    };
}

module.exports = BaseModel;
