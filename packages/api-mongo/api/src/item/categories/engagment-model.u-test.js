import mongoose from 'mongoose';
import { expect } from 'chai';
import EngagementItem from './engagement-model';
import { gameItemData } from '../../utils/item-test-utils';

mongoose.Promise = global.Promise;

describe('Engagement item model', () => {
    describe('field validations', () => {
        it('is valid when all required fields are provided', done => {
            const item = new EngagementItem(gameItemData);

            item.validate(err => {
                expect(err).to.not.exist;
                done();
            });
        });

        it('is invalid if the clientId field is empty', done => {
            const data = Object.assign({}, gameItemData);
            delete data.clientId;
            const item = new EngagementItem(data);

            item.validate(err => {
                expect(err.errors['clientId']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the clientRequest field is empty', done => {
            const data = Object.assign({}, gameItemData);
            delete data.clientRequest;
            const item = new EngagementItem(data);

            item.validate(err => {
                expect(err.errors['clientRequest']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the submittedBy field is empty', done => {
            const data = Object.assign({}, gameItemData);
            delete data.submittedBy;
            const item = new EngagementItem(data);

            item.validate(err => {
                expect(err.errors['submittedBy']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the name field is empty', done => {
            const data = Object.assign({}, gameItemData);
            delete data.name;
            const item = new EngagementItem(data);

            item.validate(err => {
                expect(err.errors['name']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the name field is not an allowed value', done => {
            const data = Object.assign({}, gameItemData, { name: 'PS4' });
            const item = new EngagementItem(data);

            item.validate(err => {
                expect(err.errors['name']).to.exist;
                expect(err.errors['name'].message).to.contain('is not a valid enum value');
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('trims the whitespace around the name field', () => {
            const data = Object.assign({}, gameItemData, { name: '  games    ' });
            const item = new EngagementItem(data);
            expect(item.name).to.equal('games');
        });

        it('transforms the name field to lowercase', () => {
            const data = Object.assign({}, gameItemData, { name: '  GAMES' });
            const item = new EngagementItem(data);
            expect(item.name).to.equal('games');
        });
    });

    describe('itemCategory', () => {
        it('is set to Engagement', () => {
            const item = new EngagementItem(gameItemData);
            expect(item.itemCategory).to.equal('Engagement');
        });
    });
});
