import { expect } from 'chai';

import { User } from '../models';
import * as Controller from './user-controller';
import { dbConnection, deleteCollection } from '../utils/db-test-utils';

const ollie = {
    name: {
        first: 'Oliver',
        last: 'Queen'
    },
    email: 'oliver@qc.com',
    program: 'employment',
    password: 'thegreenarrow',
    roles: ['admin', 'approver']
};

const dig = {
    name: {
        first: 'John',
        last: 'Diggle'
    },
    email: 'dig@qc.com',
    program: 'integrated',
    password: 'spartan',
    roles: ['approver']
};

describe('User Controller integration tests', () => {
    before(async () => await deleteCollection(dbConnection, User, 'users'));
    afterEach(async () => await deleteCollection(dbConnection, User, 'users'));

    describe('createUser()', () => {
        let ollieData;
        beforeEach(() => {
            ollieData = Object.assign({}, ollie, { name: { first: 'Oliver', last: 'Queen' } });
        });
        afterEach(async () => await deleteCollection(dbConnection, User, 'users'));

        it('creates a new user with the given data', () => {
            return Controller.createUser(ollieData).then(newUser => {
                expect(newUser).to.exist;
                expect(newUser).to.have.property('_id');
                expect(newUser).to.have.property('name');
                expect(newUser.name).to.have.property('first');
                expect(newUser.name).to.have.property('last');
                expect(newUser).to.have.property('email');
                expect(newUser).to.have.property('program');
                expect(newUser).to.have.property('roles');
                expect(newUser).to.have.property('isEmailVerified');
                expect(newUser).to.have.property('emailVerificationToken');
            });
        });

        it('rejects with validation error if first name field is not provided', () => {
            delete ollieData.name.first;
            return Controller.createUser(ollieData).catch(error => {
                expect(error).to.exist;
                expect(error.message).to.contain('User validation failed');
                expect(error.message).to.contain('Path `name.first` is required');
            });
        });

        it('rejects with validation error if last name field is not provided', () => {
            delete ollieData.name.last;
            return Controller.createUser(ollieData).catch(error => {
                expect(error).to.exist;
                expect(error.message).to.contain('User validation failed');
                expect(error.message).to.contain('Path `name.last` is required');
            });
        });

        it('rejects with validation error if email field is not provided', () => {
            delete ollieData.email;
            return Controller.createUser(ollieData).catch(error => {
                expect(error).to.exist;
                expect(error.message).to.contain('User validation failed');
                expect(error.message).to.contain('Path `email` is required');
            });
        });

        it('rejects with validation error if program field is not provided', () => {
            delete ollieData.program;
            return Controller.createUser(ollieData).catch(error => {
                expect(error).to.exist;
                expect(error.message).to.contain('User validation failed');
                expect(error.message).to.contain('Path `program` is required');
            });
        });

        it('rejects with validation error if password field is not provided', () => {
            delete ollieData.password;
            return Controller.createUser(ollieData).catch(error => {
                expect(error).to.exist;
                expect(error.message).to.contain('User validation failed');
                expect(error.message).to.contain('Path `password` is required');
            });
        });
    });

    describe('getUsers()', () => {
        it('returns an array with all the users', () => {
            return Controller.createUser(ollie)
                .then(() => Controller.createUser(dig))
                .then(() => Controller.getUsers())
                .then(users => {
                    expect(users).to.be.an('array');
                    expect(users).to.have.length(2);
                });
        });

        it('returns all users from the employment program', () => {
            return Controller.createUser(ollie)
                .then(() => Controller.createUser(dig))
                .then(() => Controller.getUsers({ program: 'employment' }))
                .then(users => {
                    expect(users).to.be.an('array');
                    expect(users).to.have.length(1);
                });
        });
    });

    describe('getUser(id)', () => {
        it('returns the user with the given id', () => {
            return Controller.createUser(ollie)
                .then(ollie => Controller.getUser(ollie._id))
                .then(user => {
                    expect(user).to.exist;
                    expect(user).to.have.property('_id');
                    expect(user).to.have.property('name');
                    expect(user.name).to.have.property('first');
                    expect(user.name).to.have.property('last');
                    expect(user).to.have.property('email');
                    expect(user).to.have.property('program');
                    expect(user).to.have.property('roles');
                });
        });
    });

    describe('updateUser(id, userData)', () => {
        it('updates the data of the user with the given id', () => {
            const email = 'diggle@qc.com';
            return Controller.createUser(dig)
                .then(diggle => Controller.updateUser(diggle._id, { email }))
                .then(user => {
                    expect(user).to.exist;
                    expect(user).to.have.property('_id');
                    expect(user).to.have.property('name');
                    expect(user.name).to.have.property('first');
                    expect(user.name).to.have.property('last');
                    expect(user).to.have.property('email');
                    expect(user).to.have.property('roles');
                    expect(user.email).to.equal(email);
                });
        });
    });

    describe('deleteUser(id)', () => {
        it('deletes the user with the given id', () => {
            return Controller.createUser(ollie)
                .then(ollie => Controller.deleteUser(ollie._id))
                .then(user => {
                    expect(user).to.exist;
                    expect(user).to.have.property('_id');
                    expect(user).to.have.property('name');
                    expect(user.name).to.have.property('first');
                    expect(user.name).to.have.property('last');
                    expect(user).to.have.property('email');
                    expect(user).to.have.property('roles');
                });
        });
    });
});
