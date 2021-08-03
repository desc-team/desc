import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcryptjs';

import User from './user-model';
import * as Middleware from './user-model-middleware';

describe('User model middleware', () => {
    describe('checkForErrors()', () => {
        let user;
        beforeEach(() => {
            user = new User({
                name: {
                    first: 'Oliver',
                    last: 'Queen'
                },
                email: 'oliver@qc.com',
                password: 'arrow',
                roles: ['admin']
            });
        });

        it('throws error if there are duplicate keys', done => {
            const expectedErrorMsg = 'There was a duplicate key error';
            const error = {
                name: 'MongoError',
                code: 11000
            };
            Middleware.checkForErrors(error, user, err => {
                expect(err).to.exist;
                expect(err.message).to.equal(expectedErrorMsg);
                done();
            });
        });

        it('propagates any other errors', done => {
            const error = new Error('Something when wrong...');
            Middleware.checkForErrors(error, user, err => {
                expect(err).to.exist;
                expect(err).to.equal(error);
                done();
            });
        });
    });

    describe('hashPassword()', () => {
        const ORIG_PWD = 'arrow';
        let user, hashPasswordFn;
        beforeEach(() => {
            user = new User({
                name: {
                    first: 'Oliver',
                    last: 'Queen'
                },
                email: 'oliver@qc.com',
                password: ORIG_PWD,
                roles: ['admin', 'approver']
            });
            hashPasswordFn = Middleware.hashPassword.bind(user);
        });

        afterEach(() => {
            user = null;
        });

        it('hashes the password to save in db', done => {
            hashPasswordFn((err, hashedUser) => {
                expect(hashedUser.password).to.not.equal(ORIG_PWD);
                expect(hashedUser.password.startsWith('$2a$')).to.be.true;
                done();
            });
        });

        it('sets the passwordLastUpdatedAt property when the password is hashed', done => {
            hashPasswordFn((err, hashedUser) => {
                expect(hashedUser.passwordLastUpdatedAt).to.exist;
                expect(hashedUser.passwordLastUpdatedAt).to.be.a('Date');
                done();
            });
        });

        it('does not hash the password if it has not changed', done => {
            user.isModified = () => false;

            hashPasswordFn((err, hashedUser) => {
                expect(err).to.not.exist;
                expect(hashedUser).to.not.exist;
                done();
            });
        });

        it('invokes the callback with an error if there was a problem with bcrypt salt', done => {
            user.isModified = () => true;

            const bcryptStub = sinon.stub(bcrypt, 'genSalt');
            bcryptStub.yields(new Error('Oops, something went wrong with the salt...'));

            hashPasswordFn((err, hashedUser) => {
                expect(err).to.exist;
                expect(hashedUser).to.not.exist;
                bcryptStub.restore();
                done();
            });
        });

        it('invokes the callback with an error if there was a problem with bcrypt hash', done => {
            user.isModified = () => true;

            const bcryptStub = sinon.stub(bcrypt, 'hash');
            bcryptStub.yields(new Error('Oops, something went wrong with the hash...'));

            hashPasswordFn((err, hashedUser) => {
                expect(err).to.exist;
                expect(hashedUser).to.not.exist;
                bcryptStub.restore();
                done();
            });
        });
    });
});
