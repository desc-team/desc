import mongoose from 'mongoose';
import { expect } from 'chai';
import PetItem from './pet-model';
import { petItemData } from '../../utils/item-test-utils';

mongoose.Promise = global.Promise;

describe('Pet item model', () => {
    describe('field validations', () => {
        it('is valid when all required fields are provided', done => {
            const item = new PetItem(petItemData);

            item.validate(err => {
                expect(err).to.not.exist;
                done();
            });
        });

        it('is invalid if the clientId field is empty', done => {
            const data = Object.assign({}, petItemData);
            delete data.clientId;
            const item = new PetItem(data);

            item.validate(err => {
                expect(err.errors['clientId']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the clientRequest field is empty', done => {
            const data = Object.assign({}, petItemData);
            delete data.clientRequest;
            const item = new PetItem(data);

            item.validate(err => {
                expect(err.errors['clientRequest']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the submittedBy field is empty', done => {
            const data = Object.assign({}, petItemData);
            delete data.submittedBy;
            const item = new PetItem(data);

            item.validate(err => {
                expect(err.errors['submittedBy']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the name field is empty', done => {
            const data = Object.assign({}, petItemData);
            delete data.name;
            const item = new PetItem(data);

            item.validate(err => {
                expect(err.errors['name']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });
    });

    describe('itemCategory', () => {
        it('is set to Pet', () => {
            const item = new PetItem(petItemData);
            expect(item.itemCategory).to.equal('Pet');
        });
    });
});
