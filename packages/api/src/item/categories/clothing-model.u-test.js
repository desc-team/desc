import mongoose from 'mongoose';
import { expect } from 'chai';

import ClothingItem from './clothing-model';
import { shirtItemData, hatItemData } from '../../utils/item-test-utils';

mongoose.Promise = global.Promise;

describe('Clothing item model', () => {
    describe('field validations', () => {
        it('is valid when all required fields are provided', done => {
            const item = new ClothingItem(shirtItemData);

            item.validate(err => {
                expect(err).to.not.exist;
                done();
            });
        });

        it('is valid when if no size is provided for a hat', done => {
            const item = new ClothingItem(hatItemData);

            item.validate(err => {
                expect(err).to.not.exist;
                done();
            });
        });

        it('is valid when if no size is provided for a scarf', done => {
            const scarfData = Object.assign({}, hatItemData, { name: 'scarf' });
            const item = new ClothingItem(scarfData);

            item.validate(err => {
                expect(err).to.not.exist;
                done();
            });
        });

        it('is valid if gender is NOT provided for hat', done => {
            const data = Object.assign({}, hatItemData, { gender: null });
            const item = new ClothingItem(data);

            item.validate(err => {
                expect(err).to.not.exist;
                done();
            });
        });

        it('is valid if gender is NOT provided for scarf', done => {
            const scarfData = Object.assign({}, hatItemData, { name: 'scarf', gender: null });
            const item = new ClothingItem(scarfData);

            item.validate(err => {
                expect(err).to.not.exist;
                done();
            });
        });

        it('is invalid if the clientId field is empty', done => {
            let data = Object.assign({}, shirtItemData);
            delete data.clientId;
            const item = new ClothingItem(data);

            item.validate(err => {
                expect(err.errors['clientId']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the clientRequest field is empty', done => {
            let data = Object.assign({}, shirtItemData);
            delete data.clientRequest;
            const item = new ClothingItem(data);

            item.validate(err => {
                expect(err.errors['clientRequest']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the submittedBy field is empty', done => {
            let data = Object.assign({}, shirtItemData);
            delete data.submittedBy;
            const item = new ClothingItem(data);

            item.validate(err => {
                expect(err.errors['submittedBy']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the name field is empty', done => {
            let data = Object.assign({}, shirtItemData);
            delete data.name;
            const item = new ClothingItem(data);

            item.validate(err => {
                expect(err.errors['name']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the gender field is empty', done => {
            let data = Object.assign({}, shirtItemData);
            delete data.gender;
            const item = new ClothingItem(data);

            item.validate(err => {
                expect(err.errors['gender']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the size field is empty for anything other than a hat or scarf', done => {
            let data = Object.assign({}, shirtItemData);
            delete data.size;
            const item = new ClothingItem(data);

            item.validate(err => {
                expect(err.errors['size']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if requesting an unavailble clothing item ', done => {
            const data = Object.assign({}, shirtItemData, { name: 'tuxedo' });
            const item = new ClothingItem(data);

            item.validate(err => {
                expect(err.errors['name']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if a man requests a bra', done => {
            const data = Object.assign({}, shirtItemData, { name: 'bra' });
            const item = new ClothingItem(data);

            item.validate(err => {
                expect(err.errors['name']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if gender is not M or F (for other than hat or scarf)', done => {
            const data = Object.assign({}, shirtItemData, { gender: 'X' });
            const item = new ClothingItem(data);

            item.validate(err => {
                expect(err.errors['gender']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it("is invalid if a correct men's size is not provided", done => {
            const data = Object.assign({}, shirtItemData, { size: 'LL (42-44)' });
            const item = new ClothingItem(data);

            item.validate(err => {
                expect(err.errors['size']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it("is invalid if a correct women's size is not provided", done => {
            const data = Object.assign({}, shirtItemData, { gender: 'F', size: 'XL (10-12)' });
            const item = new ClothingItem(data);

            item.validate(err => {
                expect(err.errors['size']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('trims the whitespace around the name field', () => {
            const data = Object.assign({}, shirtItemData, { name: '   shirt   ' });
            const item = new ClothingItem(data);
            expect(item.name).to.equal('shirt');
        });

        it('transforms the name field to lowercase', () => {
            const data = Object.assign({}, shirtItemData, { name: 'SHIRT   ' });
            const item = new ClothingItem(data);
            expect(item.name).to.equal('shirt');
        });

        it('trims the whitespace around the style field', () => {
            const data = Object.assign({}, shirtItemData, { style: '   casual   ' });
            const item = new ClothingItem(shirtItemData);
            expect(item.style).to.equal('casual');
        });

        it('transforms the style field to lowercase', () => {
            const data = Object.assign({}, shirtItemData, { style: 'Casual' });
            const item = new ClothingItem(shirtItemData);
            expect(item.style).to.equal('casual');
        });
    });

    describe('itemCategory', () => {
        it('is set to Clothing', () => {
            const item = new ClothingItem(shirtItemData);
            expect(item.itemCategory).to.equal('Clothing');
        });
    });
});
