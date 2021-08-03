import mongoose from 'mongoose';
import { expect } from 'chai';
import User from './user-model';
import * as Middleware from './user-model-middleware';

mongoose.Promise = global.Promise;

describe('User model', () => {
    describe('field validations', () => {
        let userData;
        beforeEach(() => {
            userData = Object.assign(
                {},
                {
                    name: {
                        first: 'Oliver',
                        last: 'Queen'
                    },
                    program: 'housing',
                    email: 'oliver@qc.com',
                    password: 'arrow',
                    roles: ['admin', 'approver']
                }
            );
        });

        it('is valid when all required fields are provided', done => {
            let user = new User(userData);
            user.validate(err => {
                expect(err).to.not.exist;
                done();
            });
        });

        it('is invalid if first name is empty', done => {
            delete userData.name.first;
            let user = new User(userData);

            user.validate(err => {
                expect(err.errors['name.first']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if last name is empty', done => {
            delete userData.name.last;
            let user = new User(userData);

            user.validate(err => {
                expect(err.errors['name.last']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if email is empty', done => {
            delete userData.email;
            let user = new User(userData);

            user.validate(err => {
                expect(err.errors.email).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if program is empty', done => {
            delete userData.program;
            let user = new User(userData);

            user.validate(err => {
                expect(err.errors.program).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if password is empty', done => {
            delete userData.password;
            let user = new User(userData);

            user.validate(err => {
                expect(err.errors.password).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('trims whitespace around the first name', () => {
            userData.name.first = '  Oliver  ';
            let user = new User(userData);
            expect(user.name.first).to.equal('Oliver');
        });

        it('trims whitespace around the last name', () => {
            userData.name.last = '  Queen      ';
            let user = new User(userData);
            expect(user.name.last).to.equal('Queen');
        });

        it('trims whitespace around the email address', () => {
            userData.email = '  oliver@qc.com      ';
            let user = new User(userData);
            expect(user.email).to.equal('oliver@qc.com');
        });

        it('trims whitespace around the program name', () => {
            userData.program = '     housing      ';
            let user = new User(userData);
            expect(user.program).to.equal('housing');
        });
    });

    describe('verifyPassword()', () => {
        const ORIG_PWD = 'arrow';
        let user;

        beforeEach(() => {
            user = new User({
                name: {
                    first: 'Oliver',
                    last: 'Queen'
                },
                email: 'oliver@qc.com',
                program: 'housing',
                password: ORIG_PWD,
                roles: ['admin', 'approver'],
                isModified: () => {
                    return true;
                }
            });
        });

        it('returns true if the correct password is provided', done => {
            // need to bind the middleware function to the user to ensure the
            // proper 'this' context from within the function
            Middleware.hashPassword.bind(user, (err, user) => {
                expect(user.verifyPassword(ORIG_PWD)).to.be.true;
                done();
            })();
        }).timeout(4000);

        it('returns false if an incorrect password is provided', done => {
            // need to bind the middleware function to the user to ensure the
            // proper 'this' context from within the function
            Middleware.hashPassword.bind(user, (err, user) => {
                expect(user.verifyPassword('wrongpassword')).to.be.false;
                done();
            })();
        }).timeout(4000);

        ['', null, undefined].forEach(value => {
            it(`returns false if ${value} is provided as the password`, done => {
                // need to bind the middleware function to the user to ensure the
                // proper 'this' context from within the function
                Middleware.hashPassword.bind(user, (err, user) => {
                    expect(user.verifyPassword(value)).to.be.false;
                    done();
                })();
            }).timeout(4000);
        });
    });

    describe('isAdmin()', () => {
        let baseUserData = {
            name: {
                first: 'Oliver',
                last: 'Queen'
            },
            email: 'oliver@qc.com',
            program: 'housing',
            password: 'arrow'
        };

        it('returns true if user has an admin role', () => {
            let user = new User(Object.assign({}, baseUserData, { roles: ['admin', 'approver'] }));
            expect(user.isAdmin()).to.be.true;
        });

        it('returns false if user does not have an admin role', () => {
            let user = new User(Object.assign({}, baseUserData, { roles: ['approver'] }));
            expect(user.isAdmin()).to.be.false;
        });
    });

    describe('addRole()', () => {
        let user;

        beforeEach(() => {
            user = new User({
                name: {
                    first: 'Oliver',
                    last: 'Queen'
                },
                email: 'oliver@qc.com',
                program: 'health',
                password: 'arrow',
                roles: ['admin']
            });
        });

        it('adds a valid role to a user', () => {
            user.addRole('approver');
            expect(user.roles).to.contain('admin');
            expect(user.roles).to.contain('approver');
            expect(user.roles.length).to.equal(2);
        });

        it('does not add an invalid role to a user', () => {
            user.addRole('superhero');
            expect(user.roles).to.contain('admin');
            expect(user.roles).to.not.contain('superhero');
            expect(user.roles.length).to.equal(1);
        });

        it('does not add an empty role to a user', () => {
            user.addRole('');
            expect(user.roles).to.contain('admin');
            expect(user.roles.length).to.equal(1);
        });
    });

    describe('removeRole()', () => {
        let user;

        beforeEach(() => {
            user = new User({
                name: {
                    first: 'Oliver',
                    last: 'Queen'
                },
                email: 'oliver@qc.com',
                program: 'health',
                password: 'arrow',
                roles: ['admin', 'approver', 'volunteer']
            });
        });

        it('removes a valid role from a user', () => {
            expect(user.roles.length).to.equal(3);
            user.removeRole('admin');
            expect(user.roles.length).to.equal(2);
            expect(user.roles).to.not.contain('admin');
        });

        it('ignores removing an invalid role from a user', () => {
            expect(user.roles.length).to.equal(3);
            user.removeRole('invalidRole');
            expect(user.roles.length).to.equal(3);
        });

        it('ignores removing a valid role the user does not have', () => {
            user.roles = ['approver'];
            user.removeRole('admin');
            expect(user.roles.length).to.equal(1);
            expect(user.roles).to.contain('approver');
        });
    });

    describe('toClientJSON()', () => {
        it('returns correctly shaped json', () => {
            let user = new User({
                name: {
                    first: 'Oliver',
                    last: 'Queen'
                },
                email: 'oliver@qc.com',
                program: 'employment',
                password: 'arrow',
                roles: ['admin', 'approver']
            });
            const clientJSON = user.toClientJSON();
            expect(clientJSON).to.be.an('object');
            expect(clientJSON).to.have.property('_id');
            expect(clientJSON).to.have.property('name');
            expect(clientJSON).to.have.property('email');
            expect(clientJSON).to.have.property('program');
            expect(clientJSON).to.have.property('roles');
        });
    });
});
