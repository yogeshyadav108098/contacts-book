'use strict';

const mysql = require('mysql');
const sql = require('sql');
const url = require('url');
const Logger = require('../../lib/logger');

let queryMethods = [
    'select', 'from', 'insert', 'update',
    'delete', 'create', 'drop', 'alter',
    'where', 'indexes'];

let normalizer = function(row) {
    let res = {};
    Object.keys(row).forEach(function(key) {
        let path = key.split('.');
        let plen = path.length;
        let k;
        let item;
        let obj;
        for (k = 0, obj = res; k < plen - 1; ++k) {
            item = path[k];
            if (!obj[item]) {
                obj[item] = {};
            }
            obj = obj[item];
        }
        item = path[plen - 1];
        obj[item] = row[key];
    });
    return res;
};

module.exports = function(opt) {
    let pool;
    let urlOpts = url.parse(opt.url);
    let auth = urlOpts.auth.split(':');
    let self = {};
    sql.setDialect('mysql');
    let queueLimit = opt.queueLimit || 1000;
    let enqueued = 0;

    if (urlOpts.protocol != 'mysql:') {
        console.error('invalid dialect ' + urlOpts.protocol + ' in ' + opt.url);
    }

    self.open = function() {
        if (pool) {
            return;
        }

        Logger.warn('Creating pool with', opt.connections.max, 'connections, limit', queueLimit);

        pool = mysql.createPool({
            connectionLimit: opt.connections.max || 10,
            host: urlOpts.hostname,
            user: auth[0],
            password: auth[1],
            port: urlOpts.port || 3306,
            database: urlOpts.path.substring(1),
            queueLimit: queueLimit
        });
    };


    self.terminatePool = function(cb) {
        Logger.warn('Terminating connection pool');

        if (typeof cb !== 'function') {
            cb = function(error) {
                if (error) {
                    Logger.warn('Error ocurred in terminating connection pool:', error);
                }
            };
        }

        if (!pool) {
            return cb();
        }

        pool.end(cb);
    };

    self.open();

    self.models = {};

    function extendedQuery(query) {
        let extQuery = Object.create(query);
        let self = extQuery;

        self.__extQuery = true;

        extQuery.execWithin = function(where, nested, appended, fn) {
            let query = self.toQuery(); // {text, params}
            Logger.debug(query.text, query.values);
            if (!fn) {
                return where.query(
                    {
                        sql: query.text + appended,
                        timeout: opt.timeout,
                        nestTables: nested
                    },
                    query.values
                );
            }
            return where.query(
                {
                    sql: query.text + appended,
                    timeout: opt.timeout,
                    nestTables: nested
                },
                query.values,
                function(error, res) {
                    Logger.debug('responded to ' + query.text);
                    let rows;
                    if (error) {
                        error = new Error(error);
                        error.message = 'SQL' + error.message + '\n' + query.text + appended
                            + '\n' + query.values;
                    }
                    rows = res;
                    fn(error, rows && rows.length && nested ? rows.map(normalizer) : rows);
                });
        };

        extQuery.exec = extQuery.execWithin.bind(extQuery, pool, false, '');
        extQuery.execNested = extQuery.execWithin.bind(extQuery, pool, '.', '');

        extQuery.all = extQuery.exec;

        extQuery.get = function(fn) {
            return this.exec(function(error, rows) {
                return fn(error, rows && rows.length ? rows[0] : null);
            });
        };

        extQuery.allObject = function(keyColumn, callback, mapper, filter) {
            filter = filter || function() {
                return true;
            };

            if (mapper) {
                if (typeof mapper === 'string') {
                    let str = mapper;
                    mapper = function(row) {
                        return row[str];
                    };
                } else if (typeof mapper === 'object') {
                    let arr = mapper;
                    mapper = function(row) {
                        let obj = {};
                        let j;
                        for (j = 0; j < arr.length; j++) {
                            obj[arr[j]] = row[arr[j]];
                        }
                        return obj;
                    };
                }
            } else {
                mapper = function(row) {
                    let validKeys = Object.keys(row).filter(function(key) {
                        return key != keyColumn;
                    });

                    if (validKeys.length == 0) return null;
                    else if (validKeys.length == 1) return row[validKeys[0]];
                    else {
                        let obj = {};
                        let j;
                        for (j = 0; j < validKeys.length; j++) obj[validKeys[j]] = row[validKeys[j]];
                        return obj;
                    }
                };
            }

            return this.exec(function(error, data) {
                if (error) return callback(error);

                let result = {};
                let i;
                for (i = 0; i < data.length; i++) {
                    if (filter(data[i])) {
                        result[data[i][keyColumn]] = mapper(data[i]);
                    }
                }

                callback(null, result);
            });
        };

        queryMethods.forEach(function(key) {
            extQuery[key] = function() {
                let q = query[key](...arguments); // eslint-disable-line
                if (q.__extQuery) return q;
                return extendedQuery(q);
            };
        });

        return extQuery;
    }

    function extendedTable(table) {
        // inherit everything from a regular table.
        let extTable = Object.create(table);

        // make query methods return extended queries.
        queryMethods.forEach(function(key) {
            extTable[key] = function() {
                return extendedQuery(table[key](...arguments));// eslint-disable-line
            };
        });


        // make as return extended tables.
        extTable.as = function() {
            return extendedTable(table.as(...arguments));// eslint-disable-line
        };
        return extTable;
    }


    self.define = function(opt) {
        let t = extendedTable(sql.define(...arguments));// eslint-disable-line
        self.models[opt.name] = t;
        return t;
    };

    self.functions = sql.functions;

    self.query = pool.query.bind(pool);
    self.getConnection = pool.getConnection.bind(pool);

    pool.on('enqueue', function() {
        enqueued++;
    });

    self.tooBusy = function(threshold) {
        if (enqueued > threshold) {
            return true;
        }
        return false;
    };

    setInterval(function() {
        if (enqueued) {
            warn('enqueued ' + enqueued + ' conns');
            enqueued = 0;
        }
    }, 5000);

    return self;
};
