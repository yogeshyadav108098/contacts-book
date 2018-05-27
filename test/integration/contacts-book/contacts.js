'use strict';

// 3rd Party
const Should = require('should');
const SupertTest = require('supertest');
const RandomString = require('randomstring');

// Internal
const App = require('../../../app-test');


describe('Contacts Integration test cases\n', () => {
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
            SupertTest(App)
                .post('/contacts-book/v1/contacts')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .send(contact)
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(201);
                    Should(response.body.result).be.exactly('Contacts created successfully');
                    contact.id = response.body.id;
                    done();
                });
        });

        it('Should not create a contact: CONFLICT', (done) => {
            SupertTest(App)
                .post('/contacts-book/v1/contacts')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .send(contact)
                .end((error, response) => {
                    Should.not.exist(error);

                    Should(response.statusCode).be.exactly(409);
                    Should(response.body.code).be.exactly('CONFLICT');
                    done();
                });
        });

        it('Should not create a contact: PRECONDITION_FAILED', (done) => {
            SupertTest(App)
                .post('/contacts-book/v1/contacts')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .send({})
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(412);
                    Should(response.body.code).be.exactly('PRECONDITION_FAILED');
                    done();
                });
        });

        it('Should not create a contact: USER_UNAUTHORIZED', (done) => {
            SupertTest(App)
                .post('/contacts-book/v1/contacts')
                .set('Authorization', 'Basic eW9nZ=')
                .send({})
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(401);
                    Should(response.body.code).be.exactly('USER_UNAUTHORIZED');
                    done();
                });
        });
    });

    describe('\n****************** Delete a contact ******************\n', () => {
        it('Should delete a contact: SUCCESS', (done) => {
            SupertTest(App)
                .delete('/contacts-book/v1/contacts/' + contact.id)
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body.changedRows).be.exactly(1);
                    Should(response.body.result).be.exactly('Contacts deleted successfully');
                    contact.status = 0;
                    done();
                });
        });

        it('Should not delete a contact: PRECONDITION_FAILED', (done) => {
            SupertTest(App)
                .delete('/contacts-book/v1/contacts/' + 'Undefined')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(412);
                    Should(response.body.code).be.exactly('PRECONDITION_FAILED');
                    done();
                });
        });

        it('Should not delete a contact: USER_UNAUTHORIZED', (done) => {
            SupertTest(App)
                .delete('/contacts-book/v1/contacts/' + contact.id)
                .set('Authorization', 'Basic eW9nZ=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(401);
                    Should(response.body.code).be.exactly('USER_UNAUTHORIZED');
                    done();
                });
        });
    });

    describe('\n****************** Update a contact ******************\n', () => {
        it('Should update a contact (name): SUCCESS', (done) => {
            let name = RandomString.generate({
                length: 12,
                charset: 'alphanumeric'
            });
            SupertTest(App)
                .put('/contacts-book/v1/contacts/' + contact.id)
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .send({
                    name
                })
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body.id).be.exactly(contact.id);
                    Should(response.body.result).be.exactly('Contacts edited successfully');
                    contact.name = name;
                    done();
                });
        });

        it('Should update a contact (email): SUCCESS', (done) => {
            let email = RandomString.generate({
                length: 12,
                charset: 'alphanumeric'
            }) + '@gmail.com';
            SupertTest(App)
                .put('/contacts-book/v1/contacts/' + contact.id)
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .send({
                    email
                })
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body.id).be.exactly(contact.id);
                    Should(response.body.result).be.exactly('Contacts edited successfully');
                    contact.email = email;
                    done();
                });
        });

        it('Should update a contact (email): PRECONDITION_FAILED', (done) => {
            let email = RandomString.generate({
                length: 12,
                charset: 'alphanumeric'
            });
            SupertTest(App)
                .put('/contacts-book/v1/contacts/' + contact.id)
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .send({
                    email
                })
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(412);
                    Should(response.body.code).be.exactly('PRECONDITION_FAILED');
                    done();
                });
        });

        it('Should update a contact (status): SUCCESS', (done) => {
            SupertTest(App)
                .put('/contacts-book/v1/contacts/' + contact.id)
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .send({
                    status: '1'
                })
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body.id).be.exactly(contact.id);
                    Should(response.body.result).be.exactly('Contacts edited successfully');
                    contact.status = 1;
                    done();
                });
        });

        it('Should update a contact (status): PRECONDITION_FAILED', (done) => {
            SupertTest(App)
                .put('/contacts-book/v1/contacts/' + contact.id)
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .send({
                    status: '2'
                })
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(412);
                    Should(response.body.code).be.exactly('PRECONDITION_FAILED');
                    done();
                });
        });

        it('Should update a contact (gender): SUCCESS', (done) => {
            SupertTest(App)
                .put('/contacts-book/v1/contacts/' + contact.id)
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .send({
                    gender: 'FEMALE'
                })
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body.id).be.exactly(contact.id);
                    Should(response.body.result).be.exactly('Contacts edited successfully');
                    contact.gender = 'FEMALE';
                    done();
                });
        });

        it('Should update a contact (gender): PRECONDITION_FAILED', (done) => {
            SupertTest(App)
                .put('/contacts-book/v1/contacts/' + contact.id)
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .send({
                    gender: 'FEMALE1'
                })
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(412);
                    Should(response.body.code).be.exactly('PRECONDITION_FAILED');
                    done();
                });
        });

        it('Should update a contact (gender): USER_UNAUTHORIZED', (done) => {
            SupertTest(App)
                .put('/contacts-book/v1/contacts/' + contact.id)
                .set('Authorization', 'Basic eW9nZ')
                .send({
                    gender: 'FEMALE'
                })
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(401);
                    Should(response.body.code).be.exactly('USER_UNAUTHORIZED');
                    done();
                });
        });
    });

    describe('\n****************** List contacts ******************\n', () => {
        it('Should list contacts (All default 10): SUCCESS', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body).instanceof(Array);
                    Should(response.body.length).be.lessThanOrEqual(10);
                    done();
                });
        });

        it('Should list contacts (All limit:5): SUCCESS', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts' + '?limit=5')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body).instanceof(Array);
                    Should(response.body.length).be.lessThanOrEqual(5);
                    done();
                });
        });

        it('Should list contacts (All limit:10 offet 10): SUCCESS', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts' + '?limit=10&offset=10')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body).instanceof(Array);
                    Should(response.body.length).be.lessThanOrEqual(10);
                    done();
                });
        });

        it('Should list contacts (id): SUCCESS', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts?' + 'id=' + contact.id + '&status=0,1')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body).instanceof(Array);
                    Should(response.body.length).be.exactly(1);
                    done();
                });
        });

        it('Should list contacts (beforeID): SUCCESS', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts?' + 'beforeId=' + contact.id + '&status=0,1')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body).instanceof(Array);
                    Should(response.body.length).be.greaterThanOrEqual(0);
                    done();
                });
        });

        it('Should list contacts (afterId): SUCCESS', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts?' + 'afterId=1' + '&status=0,1')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body).instanceof(Array);
                    Should(response.body.length).be.greaterThanOrEqual(0);
                    done();
                });
        });

        it('Should list contacts (columns specified): SUCCESS', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts?' + 'columns=name,email' + '&status=0,1')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body).instanceof(Array);
                    Should(response.body.length).be.greaterThanOrEqual(0);
                    done();
                });
        });

        it('Should list contacts (id): PRECONDITION_FAILED', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts?' + 'id=' + 'Undefined' + '&status=0,1')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(412);
                    Should(response.body.code).be.exactly('PRECONDITION_FAILED');
                    done();
                });
        });

        it('Should list contacts (email): SUCCESS', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts?' + 'email=' + contact.email + '&status=0,1')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body).instanceof(Array);
                    Should(response.body.length).be.exactly(1);
                    done();
                });
        });

        it('Should list contacts (email with patternMatch): SUCCESS', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts?' + 'email=' + contact.email + '&patternMatch=email')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body).instanceof(Array);
                    Should(response.body.length).be.greaterThanOrEqual(1);
                    done();
                });
        });

        it('Should list contacts (email): PRECONDITION_FAILED', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts?' + 'email=' + 'contact.email' + '&status=0,1')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(412);
                    Should(response.body.code).be.exactly('PRECONDITION_FAILED');
                    done();
                });
        });

        it('Should list contacts (name): SUCCESS', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts?' + 'name=' + contact.name + '&status=0,1')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body).instanceof(Array);
                    Should(response.body.length).be.exactly(1);
                    done();
                });
        });

        it('Should list contacts (name with patternMatch): SUCCESS', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts?' + 'name=' + contact.name + '&patternMatch=name')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body).instanceof(Array);
                    Should(response.body.length).be.greaterThanOrEqual(1);
                    done();
                });
        });

        it('Should list contacts (gender): SUCCESS', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts?' + 'gender=' + contact.gender + '&status=0,1')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body).instanceof(Array);
                    Should(response.body.length).be.greaterThanOrEqual(1);
                    done();
                });
        });

        it('Should list contacts (gender): PRECONDITION_FAILED', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts?' + 'gender=' + 'contact.gender' + '&status=0,1')
                .set('Authorization', 'Basic eW9nZXNoeWFkYXY6eW9nZXNoeWFkYXY=')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(412);
                    Should(response.body.code).be.exactly('PRECONDITION_FAILED');
                    done();
                });
        });

        it('Should list contacts : USER_UNAUTHORIZED', (done) => {
            SupertTest(App)
                .get('/contacts-book/v1/contacts')
                .set('Authorization', 'Basic eW9nZ')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(401);
                    Should(response.body.code).be.exactly('USER_UNAUTHORIZED');
                    done();
                });
        });
    });
});
