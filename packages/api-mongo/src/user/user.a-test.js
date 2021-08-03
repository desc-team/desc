import { expect } from 'chai';
import request from 'supertest';

import app from '../config/app';
import config from '../config/config';
import { User } from '../models';
import { createUser } from './user-controller';
import { dbConnection, deleteCollection } from '../utils/db-test-utils';
import { userOllie, userBarry, createUserAndGetToken } from '../utils/user-test-utils';

const AUTH_COOKIE_NAME = config.authCookieName;

const getAuthCookie = res => {
    if (res.headers['set-cookie']) {
        return res.headers['set-cookie'].find(cookie => cookie.startsWith(AUTH_COOKIE_NAME));
    }
    return '';
};

describe('User acceptance tests', () => {
    let token;
    afterEach(async () => {
        token = null;
        await deleteCollection(dbConnection, User, 'users');
    });

    context('POST /api/users', () => {
        it('returns json payload when creating a new user', () => {
            return request(app)
                .post('/api/users/')
                .send(userOllie)
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.payload).to.have.property('user');
                    expect(json.payload).to.have.property('token');
                    expect(json.success).to.be.true;
                    expect(getAuthCookie(res)).not.to.be.empty;
                });
        }).timeout(5000);

        it('returns json payload with error if required fields are not provided ', () => {
            return request(app)
                .post('/api/users/')
                .send({})
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json.success).to.be.false;
                });
        }).timeout(5000);
    });

    context('GET /api/users', () => {
        before(() => {
            return createUser(userBarry)
                .then(() => createUserAndGetToken(userOllie))
                .then(data => {
                    token = data.token;
                });
        });

        it('returns json payload with all the users', () => {
            return request
                .agent(app)
                .get('/api/users/')
                .set('Cookie', [`${AUTH_COOKIE_NAME}=${token}`])
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;
                    expect(json.payload.users).to.be.an('array');
                    expect(json.payload.users).to.have.length(2);
                });
        });
    });

    context('GET /api/users/:id', () => {
        let user;
        before(() => {
            return createUserAndGetToken(userBarry).then(data => {
                user = data.user;
                token = data.token;
            });
        });

        it('returns the user with the given id', () => {
            return request
                .agent(app)
                .get(`/api/users/${user._id}`)
                .set('Cookie', [`${AUTH_COOKIE_NAME}=${token}`])
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;
                    expect(json.payload).to.have.property('user');
                    expect(json.payload.user).to.be.an('object');
                    expect(json.payload.user).to.have.property('name');
                    expect(json.payload.user).to.have.property('email');
                    expect(json.payload.user).to.have.property('roles');
                });
        });
    });

    context('PUT /api/users/:id', () => {
        let user;
        before(() => {
            return createUserAndGetToken(userBarry).then(data => {
                user = data.user;
                token = data.token;
            });
        });

        it('updates the user with the provided data', () => {
            const updatedUserData = { email: 'flash@starlabs.com' };
            return request
                .agent(app)
                .put(`/api/users/${user._id}`)
                .set('Cookie', [`${AUTH_COOKIE_NAME}=${token}`])
                .send(updatedUserData)
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;
                    expect(json.payload).to.have.property('user');
                    expect(json.payload.user).to.be.an('object');
                    expect(json.payload.user).to.have.property('name');
                    expect(json.payload.user).to.have.property('email');
                    expect(json.payload.user).to.have.property('program');
                    expect(json.payload.user).to.have.property('roles');
                    expect(json.payload.user.email).to.equal(updatedUserData.email);
                });
        });
    });

    context('DELETE /api/users/:id', () => {
        let user;
        before(() => {
            return createUserAndGetToken(userBarry).then(data => {
                user = data.user;
                token = data.token;
            });
        });

        it('deletes the user with the given id', () => {
            return request
                .agent(app)
                .delete(`/api/users/${user._id}`)
                .set('Cookie', [`${AUTH_COOKIE_NAME}=${token}`])
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;
                    expect(json.payload).to.have.property('user');
                    expect(json.payload.user).to.be.an('object');
                    expect(json.payload.user).to.have.property('name');
                    expect(json.payload.user).to.have.property('email');
                    expect(json.payload.user).to.have.property('program');
                    expect(json.payload.user).to.have.property('roles');
                    expect(json.payload.user.email).to.equal(userBarry.email);
                });
        });
    });

    context.only('POST /api/users/testonly', () => {
        it('returns json payload with test user only', () => {
            return request(app)
                .post('/api/users/testonly')
                .send(userOllie)
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.payload).to.have.property('user');
                    expect(json.payload).not.to.have.property('token');
                    expect(json.payload.user).to.exist;
                    expect(json.success).to.be.true;
                });
        }).timeout(5000);

        it('does not send auth cookie to client', () => {
            return request(app)
                .post('/api/users/testonly')
                .send(userOllie)
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;
                    expect(getAuthCookie(res)).to.equal('');
                });
        }).timeout(5000);

        it('does not create user if not in in "testing" mode', () => {
            process.env.NODE_ENV = 'development';
            return request(app)
                .post('/api/users/testonly')
                .send(userOllie)
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.payload).to.have.property('user');
                    expect(json.payload.user).to.be.null;
                    expect(json.success).to.be.false;
                    process.env.NODE_ENV = 'testing';
                });
        }).timeout(5000);
    });
});
