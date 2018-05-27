'use strict';

// 3rd Party
const _ = require('lodash');
const Sleep = require('sleep');

// Set environment variables to App
_.set(process.env, 'PORT', '1308');
_.set(process.env, 'ENV', 'development');
_.set(process.env, 'LOG_LEVEL', 'debug');

const Q = require('q');
const Morgan = require('morgan');
const Express = require('express');
const BodyParser = require('body-parser');

// Internal
const Logger = require('./lib/logger');
const Controller = require('./controller');

const addRequestId = (new (require('uuid-logger'))()).addRequestId;

// Initialize Express App
let App = Express();
App.use(BodyParser.json({
    limit: '10mb'
}));
App.use(BodyParser.urlencoded({
    extended: true,
    limit: '10mb',
    parameterLimit: '1000'
}));

// Set Static files path
App.use(Express.static('apiDocs'));

// Add Request Id to request context
App.use(addRequestId);

// Log Request Received
App.use((req, res, next) => {
    Logger.info(req.method + ' ' + req.url);
    return next();
});

// Log Query and body params received
App.use((req, res, next) => {
    Logger.debug('Headers:', JSON.stringify(req.headers));
    Logger.debug('Query Params:', JSON.stringify(req.query));
    Logger.debug('Body Params:', JSON.stringify(req.body));
    return next();
});

// Route log with basic info
Morgan.token('user', (req, res) => req.ip);
App.use(Morgan(':method :url :status :res[Content-Length] :response-time ms :user', {
    stream: Logger.stream()
}));

process.on('uncaughtException', (error) => {
    Logger.error('Uncaught Exception: Take action immediately');
    Logger.error(error);
});

// Create controller Object
let controllerObject = new Controller({});

// Expose Routes
require('./routes')(App, controllerObject);

new Q(undefined)
    .then(() => {
        // Init Controller
        return controllerObject.init({});
    })
    .then(() => {
        // Run the service
        App.listen(_.get(process.env, 'PORT'), () => {
            Logger.info(
                'Successfully listening to port ' + _.get(process.env, 'PORT'),
                'and running in ' + _.get(process.env, 'ENV') + ' mode'
            );
        });
    })
    .fail((error) => {
        Logger.error('Service could not be started, check error');
        Logger.error(error);
        process.exit(1);
    });

Sleep.msleep(50);
module.exports = App;
