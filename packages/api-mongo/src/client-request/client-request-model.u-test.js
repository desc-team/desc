import mongoose from 'mongoose';
import { expect } from 'chai';
import ClientRequest from './client-request-model';

mongoose.Promise = global.Promise;

describe('Client request model', () => {
    describe('field validations', () => {
        it('is valid when all required fields are provided', done => {
            const request = new ClientRequest({
                clientId: '12345678',
                submittedBy: '5bb69cb1322fdf5690edfc0b',
                items: ['5bca0257b2f5ce2c899c08d3', '5bca0732ef3f813295e10966']
            });

            request.validate(err => {
                expect(err).to.not.exist;
                done();
            });
        });

        it('is invalid if the clientId field is empty', done => {
            const request = new ClientRequest({
                submittedBy: '5bb69cb1322fdf5690edfc0b',
                items: ['5bca0257b2f5ce2c899c08d3', '5bca0732ef3f813295e10966']
            });

            request.validate(err => {
                expect(err.errors['clientId']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the submittedBy field is empty', done => {
            const request = new ClientRequest({
                clientId: '12345678',
                items: ['5bca0257b2f5ce2c899c08d3', '5bca0732ef3f813295e10966']
            });

            request.validate(err => {
                expect(err.errors['submittedBy']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('trims the whitespace around the clientId', () => {
            const request = new ClientRequest({
                clientId: '  12345678     ',
                submittedBy: '5bb69cb1322fdf5690edfc0b',
                items: ['5bca0257b2f5ce2c899c08d3', '5bca0732ef3f813295e10966']
            });

            expect(request.clientId).to.equal('12345678');
        });
    });
});
