'use strict';

const contacts = {

    NAME: 'Contacts',
    COMMON_NAME: 'Contacts',
    FILTERS: [
        'email'
    ],
    COLUMNS: [
        'id',
        'name',
        'email',
        'gender',
        'status',
        'createdAt',
        'updatedAt'
    ],
    UPDATABLE_COLUMNS: [
        'name',
        'email',
        'gender',
        'status'
    ],
    RESTRICTED_COLUMNS: {},
    PATTERN_MATCH_COLUMNS: [
        'name',
        'email'
    ]
};

module.exports = contacts;
