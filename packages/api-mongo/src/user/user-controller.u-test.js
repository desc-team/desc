import { expect } from 'chai';
import sinon from 'sinon';
import 'sinon-mongoose';

import User from './user-model';
import * as Controller from './user-controller';

const mockUser = {
    name: {
        first: 'Oliver',
        last: 'Queen'
    },
    isEmailVerified: false,
    emailVerificationToken: '361f0a09175b1af647dbffe7eea9e7873a1d03fa',
    roles: ['admin', 'approver'],
    _id: '5b75f1d0c6b29e1274758754',
    email: 'oliver@qc.com',
    program: 'employment',
    password: '$2a$12$wtaoUXImI2GR1i6TY/7nPew2C8FzffowFndWgvQRcdIqtKFrGxmwi',
    createdAt: '2018-08-16T21:51:12.813Z',
    updatedAt: '2018-08-16T21:51:12.813Z',
    passwordLastUpdatedAt: '2018-08-16T21:51:13.471Z',
    __v: 0
};

describe('User Controller', () => {
    let UserMock;
    beforeEach(() => {
        UserMock = sinon.mock(User);
    });

    afterEach(() => {
        UserMock.restore();
    });
    describe('createUser()', () => {
        let newUser, userSaveStub;

        beforeEach(() => {
            userSaveStub = sinon.stub(User.prototype, 'save');

            newUser = {
                name: {
                    first: 'Oliver',
                    last: 'Queen'
                },
                email: 'oliver@qc.com',
                program: 'employment',
                password: 'thegreenarrow',
                roles: ['admin', 'approver']
            };
        });

        afterEach(() => {
            userSaveStub.restore();
        });

        it('creates a new user with the given data', () => {
            userSaveStub.resolves(mockUser);
            const promise = Controller.createUser(newUser);

            expect(promise).to.be.an('Promise');
            return promise.then(response => {
                expect(userSaveStub.calledOnce).to.be.true;
                expect(response).to.be.an('object');
                expect(response).to.have.property('name');
            });
        });

        it('rejects with an error if there is an error saving the user', () => {
            userSaveStub.rejects(new Error('Error saving the user'));
            const promise = Controller.createUser(newUser);

            expect(promise).to.be.an('Promise');
            return promise.catch(err => {
                expect(err).to.exist;
                expect(userSaveStub.calledOnce).to.be.true;
                expect(err.message).to.be.a('string');
                expect(err instanceof Error).to.be.true;
            });
        });

        it('rejects with an error if user data is not provided', () => {
            const promise = Controller.createUser();

            expect(promise).to.be.an('Promise');
            return promise.catch(err => {
                expect(err).to.exist;
                expect(userSaveStub.calledOnce).to.be.false;
                expect(err.message).to.be.a('string');
                expect(err instanceof Error).to.be.true;
            });
        });
    });

    describe('getUsers()', () => {
        it('returns an array of all users', () => {
            UserMock.expects('find')
                .withArgs({})
                .chain('exec')
                .resolves([mockUser]);

            const promise = Controller.getUsers();
            expect(promise).to.be.a('Promise');

            return promise.then(users => {
                expect(users).to.be.an('array');
                expect(users.length).to.equal(1);
            });
        });

        it('rejects with an error if something goes wrong with the db call', () => {
            UserMock.expects('find')
                .withArgs({})
                .chain('exec')
                .rejects(new Error('Oops, something went wrong fetching the users'));

            const promise = Controller.getUsers();
            expect(promise).to.be.a('Promise');

            return promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
            });
        });
    });

    describe('getUser(id)', () => {
        it('returns the user with the given id', () => {
            UserMock.expects('findById')
                .withArgs(mockUser._id)
                .chain('exec')
                .resolves(mockUser);

            const promise = Controller.getUser(mockUser._id);
            expect(promise).to.be.a('Promise');

            return promise.then(response => {
                expect(response).to.be.an('object');
                expect(response).to.have.property('name');
                expect(response.name).to.be.an('object');
                expect(response).to.have.property('email');
            });
        });

        it('rejects with an error if id is not provided', () => {
            const promise = Controller.getUser();
            expect(promise).to.be.a('Promise');

            return promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
            });
        });

        it('rejects with an error if something goes wrong with the db call', () => {
            UserMock.expects('findById')
                .chain('exec')
                .rejects(new Error('Oops, something went wrong fetching the user'));

            const promise = Controller.getUser(mockUser._id);
            expect(promise).to.be.a('Promise');

            return promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
            });
        });
    });

    describe('updateUser(id, userData)', () => {
        it('rejects with an error if id is not provided', () => {
            const promise = Controller.updateUser();
            expect(promise).to.be.a('Promise');

            return promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
            });
        });

        it('rejects with an error if something goes wrong with the db call', () => {
            UserMock.expects('findByIdAndUpdate')
                .chain('exec')
                .rejects(new Error('Oops, something went wrong updating the user'));

            const promise = Controller.updateUser(mockUser._id, { email: 'arrow@qc.com' });
            expect(promise).to.be.a('Promise');

            return promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
            });
        });

        it('returns the updated user with the given id', () => {
            const email = 'arrow@qc.com';
            let updatedUser = {
                ...mockUser,
                email
            };
            UserMock.expects('findByIdAndUpdate')
                .withArgs(mockUser._id)
                .chain('exec')
                .resolves(updatedUser);

            const promise = Controller.updateUser(mockUser._id, { email });
            expect(promise).to.be.a('Promise');

            return promise.then(response => {
                expect(response).to.be.an('object');
                expect(response).to.have.property('name');
                expect(response.name).to.be.an('object');
                expect(response).to.have.property('email');
                expect(response.email).to.equal(email);
            });
        });

        it('returns the unchaged user if no data is provided to update', () => {
            UserMock.expects('findByIdAndUpdate')
                .withArgs(mockUser._id)
                .chain('exec')
                .resolves(mockUser);

            const promise = Controller.updateUser(mockUser._id);
            expect(promise).to.be.a('Promise');

            return promise.then(response => {
                expect(response).to.be.an('object');
                expect(response).to.have.property('name');
                expect(response.name).to.be.an('object');
                expect(response).to.have.property('email');
            });
        });
    });

    describe('deleteUser(id)', () => {
        it('rejects with an error if id is not provided', () => {
            const promise = Controller.deleteUser();
            expect(promise).to.be.a('Promise');

            return promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
            });
        });

        it('rejects with an error if something goes wrong with the db call', () => {
            UserMock.expects('findByIdAndRemove')
                .chain('exec')
                .rejects(new Error('Oops, something went wrong deleting the user'));

            const promise = Controller.deleteUser(mockUser._id);
            expect(promise).to.be.a('Promise');

            return promise.catch(err => {
                expect(err).to.exist;
                expect(err).to.be.an('Error');
            });
        });

        it('returns the deleted user with the given id', () => {
            UserMock.expects('findByIdAndRemove')
                .withArgs(mockUser._id)
                .chain('exec')
                .resolves(mockUser);

            const promise = Controller.deleteUser(mockUser._id);
            expect(promise).to.be.a('Promise');

            return promise.then(response => {
                expect(response).to.be.an('object');
                expect(response).to.have.property('name');
                expect(response.name).to.be.an('object');
                expect(response).to.have.property('email');
            });
        });
    });
});
