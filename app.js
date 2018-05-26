'use strict';

// 3rd Party
const _ = require('lodash');
const Yargs = require('yargs');
let Argv = Yargs.usage('Usage: $0 [options]')
    .example('$0 -p 1308 -e development', 'Start the service')
    .alias('p', 'PORT')
    .nargs('p', 1)
    .describe('p', 'Port to run')
    .demandOption(['p'])
    .alias('e', 'ENV')
    .nargs('e', 1)
    .describe('e', 'Node Environment')
    .demandOption(['e'])
    .alias('l', 'LOG_LEVEL')
    .nargs('l', 1)
    .describe('l', 'Log Level')
    .demandOption(['l'])
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2018').argv;

// Set environment variables to App
_.set(process.env, 'PORT', Argv.PORT);
_.set(process.env, 'ENV', Argv.ENV);
_.set(process.env, 'LOG_LEVEL', Argv.LOG_LEVEL);

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
