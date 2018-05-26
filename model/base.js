'use strict';

const Q = require('q');
const _ = require('lodash');
const Logger = require('../lib/logger');
const LibUtils = require('../lib/utils');
const ResponseCodes = require('../constants/response-codes');

const sortMap = {
    desc: 'descending',
    asc: 'ascending',
    descending: 'descending',
    ascending: 'ascending'
};

const operators = ['lt', 'gt', 'lte', 'gte', 'like'];

const fieldToOperatorMap = {
    'beforeId': 'lt',
    'afterId': 'gt'
};

const fieldToOrderMap = {
    'beforeId': 'descending',
    'afterId': 'ascending'
};

let filePrefix = 'Model: Base:';

class Model {
    constructor(options, db) {
        this._modelName = options.table.NAME;
        this._columns = options.table.COLUMNS;
        this._schema = {
            'name': this._modelName,
            'columns': this._columns
        };
        this._table = db.define(this._schema);
        this._updatableColumns = options.table.UPDATABLE_COLUMNS || this._columns;
        this._updatableFilters = options.table.updatableFilters || this._columns;
        this._db = db;
    }

    list(options) {
        let selectFields;
        let filters;
        let orderFields;
        let query;

        selectFields = this.getselectFields(options);
        filters = this.prepareFilters(options);
        orderFields = this.getOrderFields(options, this);

        query = this._table.select(selectFields);

        if (filters.length) {
            query = query.where(...filters);
        }

        if (orderFields.length) {
            query = query.order(...orderFields);
        }

        if (options.limit) {
            query = query.limit(options.limit);
        }

        if (options.offset) {
            query = query.offset(options.offset);
        }

        return this.exec(query);
    }

    getselectFields(options) {
        let self = this;
        let fields = [];

        // Apply distinct clause on the column passed as value
        // example {distinctColumn: 'state'}
        if (options.distinctColumn && self._table[options.distinctColumn]) {
            fields = [self._db.functions.DISTINCT(self._table[options.distinctColumn])];
        }

        // Add distinct and count clause on the column passed as value
        // example {distinctCount: 'state'}
        if (options.distinctCount) {
            fields = fields.concat(
                [
                    self._db.functions.COUNT(
                        self._db.functions.DISTINCT(
                            self._table[options.distinctCount]
                        )
                    ).as('distinctCount')
                ]
            );
        }

        // Add count function on the column passed as value
        // example {count: 'state'}
        if (options.count) {
            fields = fields.concat([self._table[options.count].count().as('count')]);
        }

        // Apply sum function on the column passed as value
        // example {sum: 'state'}
        if (options.sum) {
            fields = fields.concat([self._table[options.sum].sum().as('sum')]);
        }

        // Apply max function on the column passed as value
        // example {sum: 'state'}
        if (options.max) {
            fields = fields.concat([self._table[options.max].max().as('max')]);
        }

        if (fields.length) {
            return fields;
        }

        if (options.columns) {
            if (!_.isArray(options.columns)) {
                options.columns = options.columns.split(',');
            }

            fields = options.columns.map((x) => self._table[x]);
        } else {
            fields = [self._table.star()];
        }

        return fields;
    }

    prepareFilters(options) {
        let filters;
        let result = [];
        filters = options.filters || (_.isObject(options) && options) || {};

        for (let f in filters) {
            if (this._columns.indexOf(f) !== -1 && filters[f] !== undefined && !(_.get(filters, 'patternMatch[f]'))) {
                if (typeof (filters[f]) === 'string' || typeof (filters[f]) === 'number') {
                    // filter based on single value
                    result.push(this._table[f].equals(filters[f]));
                } else if (_.isArray(filters[f])) {
                    // filter based on array of values
                    result.push(this._table[f].in(filters[f]));
                } else if (_.isObject(filters[f]) && filters[f].operator === 'notIn') {
                    // not in and in operator
                    if (filters[f].in) {
                        result.push(this._table[f].in(filters[f].in));
                    }

                    if (filters[f].notIn) {
                        result.push(this._table[f].notIn(filters[f].notIn));
                    }
                } else if (
                    _.isObject(filters[f]) &&
                    filters[f].from &&
                    filters[f].to &&
                    filters[f].operator === 'between'
                ) {
                    // filter based on range of values
                    result.push(this._table[f].between(filters[f].from, filters[f].to));
                } else if (
                    _.isObject(filters[f]) &&
                    filters[f].value1 &&
                    filters[f].value2 &&
                    operators.indexOf(filters[f].operator1) !== -1 &&
                    operators.indexOf(filters[f].operator2) !== -1
                ) {
                    // filter based on operators like less than/greater together etc
                    result.push(this._table[f][filters[f].operator1](filters[f].value1));
                    result.push(this._table[f][filters[f].operator2](filters[f].value2));
                } else if (
                    _.isObject(filters[f]) &&
                    filters[f].value &&
                    operators.indexOf(filters[f].operator) !== -1
                ) {
                    // filter based on operators like less than/greater than single etc
                    result.push(this._table[f][filters[f].operator](filters[f].value));
                }
            }

            if (['beforeId', 'afterId'].indexOf(f) !== -1 && filters[f] !== undefined) {
                let operator = fieldToOperatorMap[f];
                result.push(this._table.id[operator](filters[f]));
            }

            if (['patternMatch'].indexOf(f) !== -1 && filters[f] !== undefined) {
                let x = this;
                Object.keys(filters[f]).forEach((field) => { // jshint ignore:line
                    result.push(x._table[field].like('%' + filters[f][field] + '%'));
                });
            }
        }
        return result;
    }

    insert(object) {
        let query;
        if (!_.isObject(object) && !_.isArray(object)) {
            return Q.reject(
                LibUtils.genError('Invalid insert object !!!',
                    ResponseCodes.UNABLE_TO_PROCESS.status,
                    ResponseCodes.UNABLE_TO_PROCESS.code
                )
            );
        }
        query = this._table.insert(object);
        return this.exec(query);
    }

    update(options) {
        let id = options.id;
        let updateFields = {};

        if (!_.isObject(options)) {
            return Q.reject(
                LibUtils.genError(
                    'Invalid update object !!!',
                    ResponseCodes.UNABLE_TO_PROCESS.status,
                    ResponseCodes.UNABLE_TO_PROCESS.code
                )
            );
        }
        if (!parseInt(id)) {
            return Q.reject(
                LibUtils.genError(
                    'ID not provided to process !!!',
                    ResponseCodes.UNABLE_TO_PROCESS.status,
                    ResponseCodes.UNABLE_TO_PROCESS.code
                )
            );
        }

        for (let column in options) {
            if (this._updatableColumns.indexOf(column) === -1) {
                return Q.reject(
                    LibUtils.genError(
                        'Cannot update column: !!!' + column,
                        ResponseCodes.UNABLE_TO_PROCESS.status,
                        ResponseCodes.UNABLE_TO_PROCESS.code
                    )
                );
            } else {
                updateFields[column] = options[column];
            }
        }

        let query = this._table.update(updateFields).where(this._table.id.equals(id));

        return this.exec(query, 'update');
    }

    bulkUpdate(options) {
        let f;
        let query;
        let fields = options.fields;
        let filters = options.filters;

        // validations
        if (!_.isObject(fields)) {
            return Q.reject(
                LibUtils.genError(
                    'Invalid fields in update object !!!',
                    ResponseCodes.UNABLE_TO_PROCESS.status,
                    ResponseCodes.UNABLE_TO_PROCESS.code
                )
            );
        }

        for (f in fields) {
            if (this._updatableColumns.indexOf(f) === -1) {
                return Q.reject(
                    LibUtils.genError(
                        'Cannot update column:' + f,
                        ResponseCodes.UNABLE_TO_PROCESS.status,
                        ResponseCodes.UNABLE_TO_PROCESS.code
                    )
                );
            }
        }

        for (f in filters) {
            if (this._updatableFilters.indexOf(f) === -1) {
                return Q.reject(
                    LibUtils.genError(
                        'Cannot update table for filter:' + f,
                        ResponseCodes.UNABLE_TO_PROCESS.status,
                        ResponseCodes.UNABLE_TO_PROCESS.code
                    )
                );
            }
        }

        filters = this.prepareFilters({filters: filters});
        if (!filters.length) {
            return Q.reject(
                LibUtils.genError(
                    'No filters found while updating',
                    ResponseCodes.UNABLE_TO_PROCESS.status,
                    ResponseCodes.UNABLE_TO_PROCESS.code
                )
            );
        }

        query = this._table.update(fields);
        query.where(...filters);
        return this.exec(query, 'update');
    }

    exec(query, type) {
        let deferred = Q.defer();
        let functionPrefix = 'Exec:';
        Logger.info(filePrefix, functionPrefix, JSON.stringify(query.toQuery()));

        query.exec((error, result) => {
            if (error) {
                return deferred.reject(error);
            }

            if (type === 'update') {
                return deferred.resolve(result && result.changedRows);
            }

            return deferred.resolve(result);
        });
        return deferred.promise; // jshint ignore:line
    }

    getOrderFields(options, object) {
        let fields = [];
        if (_.isObject(options.orderBy)) {
            for (let f in options.orderBy) {
                if (object._table[f]) {
                    fields.push(object._table[f][sortMap[options.orderBy[f]]]);
                }
            }
        }

        if (options.beforeId) {
            fields.push(object._table.id[fieldToOrderMap.beforeId]);
        }

        if (options.afterId) {
            fields.push(object._table.id[fieldToOrderMap.afterId]);
        }

        return fields;
    }
}

module.exports = Model;
