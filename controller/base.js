'use strict';

// 3rd Party
const Q = require('q');
const _ = require('lodash');

// Internal
const Logger = require('../lib/logger');
const Response = new (require('./common/response'))();
const ResponseCodes = require('../constants/response-codes');

class BaseController {
    constructor(options) {
        this._table = options.table;
        this._api = options.api;
    }

    create(req, res, next) {
        let self = this;
        let options = req.body.data || req.body;

        new Q(undefined)
            .then(function(undefined) {
                return self._api.basic.insert(options);
            })
            .then(function(result) {
                // Rare scenario, when no error but also no result
                if (result === undefined) {
                    return Response.sendFailure(
                        next,
                        ResponseCodes.custom(
                            'Error in accessing ' + self._table + ' table',
                            ResponseCodes.INTERNAL_SERVER_ERROR.status,
                            ResponseCodes.INTERNAL_SERVER_ERROR.code
                        )
                    );
                }

                let responseMessage = {
                    id: result.insertId.toString(),
                    result: self._table + ' created successfully'
                };

                _.set(req, 'lastMiddlewareResponse', {
                    status: ResponseCodes.CREATED.status,
                    respToSend: responseMessage
                });
                _.set(req, 'lastMiddlewareResult', result);

                return next();
            })
            .fail(function(error) {
                Logger.error(error);
                if (
                    error.toString().indexOf('ER_DUP_ENTRY') > -1 ||
                    error.toString().indexOf('Resource already exists') > -1
                ) {
                    error.status = 409;
                    return Response.sendFailure(next, ResponseCodes.CONFLICT);
                }
                return Response.sendFailure(
                    next,
                    ResponseCodes.custom(
                        'Error in accessing ' + self._table + ' table',
                        error.status || ResponseCodes.INTERNAL_SERVER_ERROR.status,
                        ResponseCodes.INTERNAL_SERVER_ERROR.code
                    )
                );
            });
    }

    delete(req, res, next) {
        let self = this;
        let id = req.params.id || req.query.id;

        if (id === undefined) {
            return Response.sendFailure(
                next,
                ResponseCodes.custom(
                    'No id to delete ',
                    ResponseCodes.PRECONDITION_FAILED.status,
                    ResponseCodes.PRECONDITION_FAILED.code
                )
            );
        }

        let options = {
            id: id
        };

        new Q(undefined)
            .then(function(undefined) {
                return self._api.basic.delete(options);
            })
            .then(function(result) {
                // Rare scenario, when no error but also no result
                if (result === undefined) {
                    return Response.sendFailure(
                        next,
                        ResponseCodes.custom(
                            'Error in accessing ' + self._table + ' table',
                            ResponseCodes.INTERNAL_SERVER_ERROR.status,
                            ResponseCodes.INTERNAL_SERVER_ERROR.code
                        )
                    );
                }

                let responseMessage = {
                    id: result.id,
                    changedRows: result.changedRows,
                    result: self._table + ' deleted successfully'
                };

                _.set(req, 'lastMiddlewareResponse', {
                    status: ResponseCodes.OK.status,
                    respToSend: responseMessage
                });
                _.set(req, 'lastMiddlewareResult', result);
                return next();
            })
            .fail(function(error) {
                Logger.error(error);
                return Response.sendFailure(
                    next,
                    ResponseCodes.custom(
                        'Error in accessing ' + self._table + ' table',
                        error.status || ResponseCodes.INTERNAL_SERVER_ERROR.status,
                        ResponseCodes.INTERNAL_SERVER_ERROR.code
                    )
                );
            });
    }

    list(req, res, next) {
        let self = this;
        let filters = _.get(req, 'query') || _.get(req, 'body');

        if (_.isEmpty(req.query)) {
            filters = _.get(req, 'body');
        }

        new Q(undefined)
            .then(function(undefined) {
                return self._api.basic.list(filters);
            })
            .then(function(result) {
                // Rare scenario, when no error but also no result
                if (result === undefined) {
                    return Response.sendFailure(
                        next,
                        ResponseCodes.custom(
                            'Error in accessing ' + self._table + ' table',
                            ResponseCodes.INTERNAL_SERVER_ERROR.status,
                            ResponseCodes.INTERNAL_SERVER_ERROR.code
                        )
                    );
                }

                _.set(req, 'lastMiddlewareResponse', {
                    status: ResponseCodes.OK.status,
                    respToSend: result
                });
                _.set(req, 'lastMiddlewareResult', result);
                return next();
            })
            .fail(function(error) {
                Logger.error(error);
                return Response.sendFailure(
                    next,
                    ResponseCodes.custom(
                        'Error in accessing ' + self._table + ' table',
                        error.status || ResponseCodes.INTERNAL_SERVER_ERROR.status,
                        ResponseCodes.INTERNAL_SERVER_ERROR.code
                    )
                );
            });
    }

    update(req, res, next) {
        let self = this;
        let id = req.params.id || req.query.id || req.body.id;

        if (id === undefined) {
            return Response.sendFailure(
                next,
                ResponseCodes.custom(
                    'No id to update ',
                    ResponseCodes.PRECONDITION_FAILED.status,
                    ResponseCodes.PRECONDITION_FAILED.code
                )
            );
        }

        let options = req.body;
        options.id = id;
        new Q(undefined)
            .then(function(undefined) {
                return self._api.basic.update(options);
            })
            .then(function(result) {
                // Rare scenario, when no error but also no result
                if (result === undefined) {
                    return Response.sendFailure(
                        next,
                        ResponseCodes.custom(
                            'Error in accessing ' + self._table + ' table',
                            ResponseCodes.INTERNAL_SERVER_ERROR.status,
                            ResponseCodes.INTERNAL_SERVER_ERROR.code
                        )
                    );
                }

                let responseMessage = {
                    id: id,
                    result: self._table + ' edited successfully'
                };

                _.set(req, 'lastMiddlewareResponse', {
                    status: ResponseCodes.OK.status,
                    respToSend: responseMessage
                });
                _.set(req, 'lastMiddlewareResult', result);
                return next();
            })
            .fail(function(error) {
                Logger.error(error);
                return Response.sendFailure(
                    next,
                    ResponseCodes.custom(
                        'Error in accessing ' + self._table + ' table',
                        error.status || ResponseCodes.INTERNAL_SERVER_ERROR.status,
                        ResponseCodes.INTERNAL_SERVER_ERROR.code
                    )
                );
            });
    }
}

module.exports = BaseController;
