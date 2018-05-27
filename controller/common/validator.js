'use strict';

const Q = require('q');
const _ = require('lodash');
const AjvModule = require('ajv');
const Schemas = require('../../schemas');
const Logger = require('../../lib/logger');
const Response = new (require('../common/response'))();
const SchemaNames = require('../../config/schema-names');
const ResponseCodes = require('../../constants/response-codes');

const Ajv = AjvModule({allErrors: true, removeAdditional: 'all'});
const filePrefix = 'Controller: Validator:';

class Validator {
    constructor(options, controller) {
        let functionPrefix = 'Constructor:';
        Logger.info(filePrefix, functionPrefix, 'Constructing...');
        Logger.info(filePrefix, functionPrefix, 'Constructed');
    }

    init(options) {
        let functionPrefix = 'Init:';
        Logger.info(filePrefix, functionPrefix, 'Initiating...');

        // Adding schemas
        Ajv.addSchema(Schemas.contactsBook.contacts.add, SchemaNames.contactsBook.contacts.add);
        Ajv.addSchema(Schemas.contactsBook.contacts.update, SchemaNames.contactsBook.contacts.update);
        Ajv.addSchema(Schemas.contactsBook.contacts.delete, SchemaNames.contactsBook.contacts.delete);
        Ajv.addSchema(Schemas.contactsBook.contacts.list, SchemaNames.contactsBook.contacts.list);

        Logger.info(filePrefix, functionPrefix, 'Initiated');
        return Q.resolve();
    }

    errorResponse(schemaErrors) {
        let errors = schemaErrors.map((error) => {
            return error.dataPath + ':' + error.message;
        });
        return errors;
    }

    validateSchema(schemaName) {
        let self = this;
        return (req, res, next) => {
            let bodyReceived = _.merge({}, req.query, req.params, req.body);
            let valid = Ajv.validate(schemaName, bodyReceived);
            if (!valid) {
                return Response.sendFailure(next, ResponseCodes.custom(
                    'Schema Validation Failed: Errors: ' + JSON.stringify(self.errorResponse(Ajv.errors)),
                    ResponseCodes.PRECONDITION_FAILED.status,
                    ResponseCodes.PRECONDITION_FAILED.code
                ));
            }
            return next();
        };
    };
}


module.exports = Validator;


