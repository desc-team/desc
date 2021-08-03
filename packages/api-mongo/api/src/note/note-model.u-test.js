import mongoose from 'mongoose';
import { expect } from 'chai';
import Note from './note-model';

mongoose.Promise = global.Promise;

describe('Note model', () => {
    describe('field validations', () => {
        it('is valid when all required fields are provided', done => {
            const note = new Note({
                itemId: '5bca0791ff6a4733293a5977',
                submittedBy: '5bb69cb1322fdf5690edfc0b',
                body: 'This is a test note to use in the unit tests'
            });

            note.validate(err => {
                expect(err).to.not.exist;
                done();
            });
        });

        it('is invalid if the itemId field is empty', done => {
            const note = new Note({
                submittedBy: '5bb69cb1322fdf5690edfc0b',
                body: 'This is a test note to use in the unit tests'
            });

            note.validate(err => {
                expect(err.errors['itemId']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the submittedBy field is empty', done => {
            const note = new Note({
                itemId: '5bca0791ff6a4733293a5977',
                body: 'This is a test note to use in the unit tests'
            });

            note.validate(err => {
                expect(err.errors['submittedBy']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the body field is empty', done => {
            const note = new Note({
                itemId: '5bca0791ff6a4733293a5977',
                submittedBy: '5bb69cb1322fdf5690edfc0b'
            });

            note.validate(err => {
                expect(err.errors['body']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });
    });
});
