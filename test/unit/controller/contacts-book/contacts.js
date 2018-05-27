'use strict';

// 3rd Party
const Q = require('q');
const Sinon = require('sinon');
const Should = require('should');
const RandomString = require('randomstring');

// Internal
const LibUtils = require('../../../../lib/utils');
const ResponseCodes = require('../../../../constants/response-codes');
const ContactsApi = new (require('../../../../api/contacts-book/contacts'));
const ContactsController = new (require('../../../../controller/contacts-book/contacts'));

describe('Contacts controller unit test cases\n', () => {
    let contact = {
        name: RandomString.generate({
            length: 12,
            charset: 'alphanumeric'
        }),
        email: RandomString.generate({
            length: 12,
            charset: 'alphanumeric'
        }) + '@gmail.com',
        gender: 'MALE',
        status: '1'
    };

    describe('\n****************** Create a contact ******************\n', () => {
        it('Should create a contact: SUCCESS', (done) => {
            let sandbox = Sinon.createSandbox();
            const insertApi = sandbox.stub(ContactsApi, 'insert').callsFake((options) => {
                let responses = [
                    {
                        error: undefined,
                        result: undefined
                    },
                    {
                        error: undefined,
                        result: {
                            insertId: 1,
                            changedRows: 1
                        }
                    },
                    {
                        error: LibUtils.genError(
                            'Resource already exists : ER_DUP_ENTRY',
                            ResponseCodes.CONFLICT.status,
                            ResponseCodes.CONFLICT.code
                        ),
                        result: undefined
                    },
                    {
                        error: LibUtils.genError(
                            'Resource already exists : ER_DUP_ENTRY',
                            ResponseCodes.INTERNAL_SERVER_ERROR.status,
                            ResponseCodes.INTERNAL_SERVER_ERROR.code
                        ),
                        result: undefined
                    }

                ];

                let response = responses[LibUtils.getRandomNumber(0, 3)];
                if (response.error) {
                    return Q.reject(response.error);
                }

                return Q.resolve(response.result);
            });

            ContactsController.create({body: contact}, {}, (error, result) => {
                console.log(error, result);
                sandbox.restore();
                done();
            });
        });
    });
});
