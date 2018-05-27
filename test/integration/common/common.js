'use strict';

const Should = require('should');
const SupertTest = require('supertest');
const App = require('../../../app-test');

describe('Common Integration test cases\n', () => {
    describe('\n****************** Health Check ******************\n', () => {
        it('Should check health: SUCCESS', (done) => {
            SupertTest(App)
                .get('/contacts-book/_status')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body.result).be.exactly('OK');
                    done();
                });
        });
    });

    describe('\n****************** ApiDoc Gen ******************\n', () => {
        it('Should create apiDoc: SUCCESS', (done) => {
            SupertTest(App)
                .get('/contacts-book/apiDoc')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    done();
                });
        });
    });

    describe('\n****************** ReadMe Gen ******************\n', () => {
        it('Should create readMe: SUCCESS', (done) => {
            SupertTest(App)
                .get('/contacts-book/readMe')
                .end((error, response) => {
                    Should.not.exist(error);
                    Should(response.statusCode).be.exactly(200);
                    Should(response.body.result).be.exactly('ReadMe file generated');
                    done();
                });
        });
    });
});
