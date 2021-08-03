import mongoose from 'mongoose';
import { expect } from 'chai';
import PersonalHygieneItem from './personalhygiene-model';
import { soapItemData } from '../../utils/item-test-utils';

mongoose.Promise = global.Promise;

describe('Personal hygiene item model', () => {
    describe('field validations', () => {
        it('is valid when all required fields are provided', done => {
            const item = new PersonalHygieneItem(soapItemData);

            item.validate(err => {
                expect(err).to.not.exist;
                done();
            });
        });

        it('is invalid if the clientId field is empty', done => {
            const data = Object.assign({}, soapItemData);
            delete data.clientId;
            const item = new PersonalHygieneItem(data);

            item.validate(err => {
                expect(err.errors['clientId']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the clientRequest field is empty', done => {
            const data = Object.assign({}, soapItemData);
            delete data.clientRequest;
            const item = new PersonalHygieneItem(data);

            item.validate(err => {
                expect(err.errors['clientRequest']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the submittedBy field is empty', done => {
            const data = Object.assign({}, soapItemData);
            delete data.submittedBy;
            const item = new PersonalHygieneItem(data);

            item.validate(err => {
                expect(err.errors['submittedBy']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the name field is empty', done => {
            const data = Object.assign({}, soapItemData);
            delete data.name;
            const item = new PersonalHygieneItem(data);

            item.validate(err => {
                expect(err.errors['name']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the name field is not an allowed value', done => {
            const data = Object.assign({}, soapItemData, { name: 'hair gel' });
            const item = new PersonalHygieneItem(data);

            item.validate(err => {
                expect(err.errors['name']).to.exist;
                expect(err.errors['name'].message).to.contain('is not a valid enum value');
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('trims the whitespace around the name field', () => {
            const data = Object.assign({}, soapItemData, { name: '  soap   ' });
            const item = new PersonalHygieneItem(data);
            expect(item.name).to.equal('soap');
        });

        it('transforms the name field to lowercase', () => {
            const data = Object.assign({}, soapItemData, { name: ' SoAP  ' });
            const item = new PersonalHygieneItem(data);
            expect(item.name).to.equal('soap');
        });
    });

    describe('itemCategory', () => {
        it('is set to PersonalHygiene', () => {
            const item = new PersonalHygieneItem(soapItemData);
            expect(item.itemCategory).to.equal('PersonalHygiene');
        });
    });
});
