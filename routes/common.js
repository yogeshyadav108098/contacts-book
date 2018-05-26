'use strict';

const {bind} = require('../lib/utils');

module.exports = function(app, controllerObject) {
    /**
     * @api {get} /contacts-book/_status Health Check Status
     * @apiName HealthCheckStatus
     * @apiGroup HealthCheck
     *
     * @apiSuccessExample Success-Response:
     * {
     *    result: 'OK'
     * }
     */
    app.get(
        '/contacts-book/_status',
        bind(controllerObject.common.healthCheck, 'healthCheck'),
        bind(controllerObject.common.response, 'setResponse'),
        bind(controllerObject.common.response, 'sendResponse'),
        bind(controllerObject.common.error, 'handleError')
    );

    /**
     * @api {get} /contacts-book/apiDoc API DOC
     * @apiName APIDoc
     * @apiGroup APIDoc
     *
     * @apiSuccessExample Success-Response:
     *   generates html page
     */
    app.get(
        '/contacts-book/apiDoc',
        bind(controllerObject.common.apiDoc, 'runApiDoc'),
        bind(controllerObject.common.apiDoc, 'renderApiDoc'),
        bind(controllerObject.common.error, 'handleError')
    );

    /**
     * @api {get} /contacts-book/readme API DOC
     * @apiName ReadMe
     * @apiGroup Readme
     *
     * @apiSuccessExample Success-Response:
     * {
     *    result: 'ReadMe file generated'
     * }
     */
    app.get(
        '/contacts-book/readme',
        bind(controllerObject.common.apiDoc, 'runApiDoc'),
        bind(controllerObject.common.readMeGen, 'runReadme'),
        bind(controllerObject.common.response, 'setResponse'),
        bind(controllerObject.common.response, 'sendResponse'),
        bind(controllerObject.common.error, 'handleError')
    );
};
