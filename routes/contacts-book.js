'use strict';

const {bind} = require('../lib/utils');
const SchemaNames = require('../config/schema-names');

module.exports = (app, controllerObject) => {
    /**
     * @api {post} /contacts-book/v1/contacts/add Add
     * @apiName CreateContact
     * @apiGroup Contacts
     *
     * @apiParam {String} name Name
     * @apiParam {String} email Email
     * @apiParam {String} gender Gender (Default Value MALE)
     *
     * @apiSuccessExample Success-Response:
     *   {
     *        id:  1
     *        result: Contact created successfully
     *   }
     */
    app.post('/contacts-book/v1/contacts/add',
        bind(controllerObject.common.validator, 'validateSchema')(SchemaNames.contactsBook.contacts.add),
        bind(controllerObject.contactsBook.contacts, 'create'),
        bind(controllerObject.common.response, 'setResponse'),
        bind(controllerObject.common.response, 'sendResponse'),
        bind(controllerObject.common.error, 'handleError')
    );

    /**
     * @api {get} /contacts-book/v1/contacts/list List
     * @apiName ListContacts
     * @apiGroup Contacts
     *
     * @apiParam {Number} id Id
     * @apiParam {String} name Name
     * @apiParam {String} email Email
     * @apiParam {String} gender Gender
     * @apiParam {String} status Status
     * @apiParam {Number} beforeId Before Id
     * @apiParam {Number} afterId afterId
     * @apiParam {Number} limit limit
     * @apiParam {Number} offset offset
     * @apiParam {String} orderBy Order by
     * @apiParam {String} patternMatch Pattern (true)
     * @apiParam {String} columns Columns
     * @apiParam {String} count Count (id)
     * @apiParam {String} distinctColumn Distinct Column (id)
     * @apiParam {String} distinctCount Distinct Count (id)
     *
     * @apiSuccessExample Success-Response:
     * [{
     *    "id": 1,
     *    "name": "Yogesh Yadav",
     *    "email": "yogeshyadav108098@gmail.com",
     *    "gender": "MALE",
     *    "status": 1,
     *    "createdAt": "2017-05-26T11:57:37.000Z",
     *    "updatedAt": "2017-05-26T11:57:37.000Z"
     * }]
     */
    app.get('/contacts-book/v1/contacts/list',
        bind(controllerObject.common.validator, 'validateSchema')(SchemaNames.contactsBook.contacts.list),
        bind(controllerObject.contactsBook.contacts, 'list'),
        bind(controllerObject.common.response, 'setResponse'),
        bind(controllerObject.common.response, 'sendResponse'),
        bind(controllerObject.common.error, 'handleError')
    );

    /**
     * @api {put} /contacts-book/v1/contacts/update/:id Update
     * @apiName UpdateContacts
     * @apiGroup Contacts
     *
     * @apiParam {Number} id Contact DB Id
     * @apiParam {String} name Name
     * @apiParam {String} email Email
     * @apiParam {String} gender Gender
     * @apiParam {Number} status Status
     *
     * @apiSuccessExample Success-Response:
     *   {
     *        id:  1
     *        result: Contact edited successfully
     *   }
     */
    app.put('/contacts-book/v1/contacts/update/:id',
        bind(controllerObject.common.validator, 'validateSchema')(SchemaNames.contactsBook.contacts.update),
        bind(controllerObject.contactsBook.contacts, 'update'),
        bind(controllerObject.common.response, 'setResponse'),
        bind(controllerObject.common.response, 'sendResponse'),
        bind(controllerObject.common.error, 'handleError')
    );

    /**
     * @api {delete} /contacts-book/v1/contacts/delete/:id Delete
     * @apiName DeleteContacts
     * @apiGroup Contacts
     *
     * @apiParam {Number} id Contact DB Id
     *
     * @apiSuccessExample Success-Response:
     *   {
     *        id:  1,
     *        changedRows:  1,
     *        result: Contact deleted successfully
     *   }
     */
    app.delete('/contacts-book/v1/contacts/delete/:id',
        bind(controllerObject.common.validator, 'validateSchema')(SchemaNames.contactsBook.contacts.delete),
        bind(controllerObject.contactsBook.contacts, 'delete'),
        bind(controllerObject.common.response, 'setResponse'),
        bind(controllerObject.common.response, 'sendResponse'),
        bind(controllerObject.common.error, 'handleError')
    );
};
