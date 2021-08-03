import { expect } from 'chai';
import request from 'supertest';

import app from '../config/app';
import { User } from '../models';
import { createUser } from '../user/user-controller';
import { userOllie } from '../utils/user-test-utils';
import { dbConnection, deleteCollection } from '../utils/db-test-utils';

describe('Auth acceptance tests', () => {
    beforeEach(() => createUser(userOllie));
    afterEach(async () => await deleteCollection(dbConnection, User, 'users'));

    describe('POST /api/auth/login', () => {
        it('returns json with user and token on success', () => {
            return request(app)
                .post('/api/auth/login')
                .send({ email: userOllie.email, password: userOllie.password })
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.payload).to.have.property('user');
                    expect(json.payload).to.have.property('token');
                    expect(json.success).to.be.true;
                });
        });

        it('returns status code of 401 if password is incorrect', () => {
            return request(app)
                .post('/api/auth/login')
                .send({ email: userOllie.email, password: 'wrongPassword' })
                .expect(401);
        });

        it('returns status code of 401 if user (email) is not found', () => {
            return request(app)
                .post('/api/auth/login')
                .send({ email: 'ollie@qc.com', password: userOllie.password })
                .expect(401);
        });
    });

    describe('GET /api/auth/logout', () => {
        it('returns json payload on success', () => {
            return request(app)
                .get('/api/auth/logout')
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                });
        });
    });
});
