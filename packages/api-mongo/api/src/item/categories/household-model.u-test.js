import mongoose from 'mongoose';
import { expect } from 'chai';
import HouseholdItem from './household-model';
import { beddingItemData } from '../../utils/item-test-utils';

mongoose.Promise = global.Promise;

describe('Household item model', () => {
    describe('field validations', () => {
        it('is valid when all required fields are provided', done => {
            const item = new HouseholdItem(beddingItemData);

            item.validate(err => {
                expect(err).to.not.exist;
                done();
            });
        });

        it('is invalid if the clientId field is empty', done => {
            const data = Object.assign({}, beddingItemData);
            delete data.clientId;
            const item = new HouseholdItem(data);

            item.validate(err => {
                expect(err.errors['clientId']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the clientRequest field is empty', done => {
            const data = Object.assign({}, beddingItemData);
            delete data.clientRequest;
            const item = new HouseholdItem(data);

            item.validate(err => {
                expect(err.errors['clientRequest']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the submittedBy field is empty', done => {
            const data = Object.assign({}, beddingItemData);
            delete data.submittedBy;
            const item = new HouseholdItem(data);

            item.validate(err => {
                expect(err.errors['submittedBy']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the name field is empty', done => {
            const data = Object.assign({}, beddingItemData);
            delete data.name;
            const item = new HouseholdItem(data);

            item.validate(err => {
                expect(err.errors['name']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the name field is not an allowed value', done => {
            const data = Object.assign({}, beddingItemData, { name: 'iPad' });
            const item = new HouseholdItem(data);

            item.validate(err => {
                expect(err.errors['name']).to.exist;
                expect(err.errors['name'].message).to.contain('is not a valid enum value');
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('trims the whitespace around the name field', () => {
            const data = Object.assign({}, beddingItemData, { name: '  plates    ' });
            const item = new HouseholdItem(data);
            expect(item.name).to.equal('plates');
        });

        it('transforms the name field to lowercase', () => {
            const data = Object.assign({}, beddingItemData, { name: '  PlateS ' });
            const item = new HouseholdItem(data);
            expect(item.name).to.equal('plates');
        });
    });

    describe('itemCategory', () => {
        it('is set to Household', () => {
            const item = new HouseholdItem(beddingItemData);
            expect(item.itemCategory).to.equal('Household');
        });
    });
});
