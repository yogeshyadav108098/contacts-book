'use strict';

module.exports = {

    add: {
        title: 'Contact Add',
        description: 'Adding a contact',
        type: 'object',
        properties: {
            name: {
                type: 'string',
                maxLength: 256,
                description: 'Name of the contact'
            },
            email: {
                type: 'string',
                maxLength: 256,
                format: 'email',
                description: 'Email of the contact'
            },
            gender: {
                enum: ['FEMALE', 'MALE'],
                description: 'Gender of the contact'
            }
        },
        required: [
            'name',
            'email'
        ]
    },

    update: {
        title: 'Contact Edit',
        description: 'Editing a contact',
        type: 'object',
        properties: {
            name: {
                type: 'string',
                maxLength: 256,
                description: 'Name of the contact'
            },
            email: {
                type: 'string',
                maxLength: 256,
                format: 'email',
                description: 'Email of the contact'
            },
            gender: {
                enum: ['FEMALE', 'MALE'],
                description: 'Gender of the contact'
            },
            status: {
                type: ['string', 'integer'],
                maxLength: 2,
                description: 'Status of Contact'
            }
        },
        additionalProperties: false,
        minProperties: 1
    },

    delete: {
        title: 'Contact Delete',
        description: 'Deleting a contact',
        type: 'object',
        properties: {
        },
        additionalProperties: false,
        minProperties: 0
    },

    list: {
        title: 'Contact List',
        description: 'Listing contacts',
        type: 'object',
        properties: {

        },
        additionalProperties: false,
        minProperties: 0
    }

};
