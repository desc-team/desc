import mongoose from 'mongoose';
import { expect } from 'chai';
import Item from './baseitem-model';

mongoose.Promise = global.Promise;

describe('Base item model', () => {
    let itemData;
    beforeEach(() => {
        itemData = Object.assign(
            {},
            {
                clientId: '12345678',
                clientRequest: '5c0179dd9c55a711053087cb',
                submittedBy: '5bb69cb1322fdf5690edfc0b',
                location: 'Rainier House'
            }
        );
    });

    describe('field validations', () => {
        it('is valid when all required fields are provided', done => {
            const item = new Item(itemData);

            item.validate(err => {
                expect(err).to.not.exist;
                done();
            });
        });

        ['clientId', 'submittedBy', 'clientRequest', 'location'].forEach(field => {
            it(`is invalid if the ${field} field is empty`, done => {
                delete itemData[field];
                const item = new Item(itemData);
                item.validate(err => {
                    expect(err.errors[field]).to.exist;
                    expect(err.name).to.equal('ValidationError');
                    done();
                });
            });
        });

        it('is invalid if urgency provided is not allowed', done => {
            itemData.urgency = 'asap';
            const item = new Item(itemData);

            item.validate(err => {
                expect(err.errors['urgency']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if status provided is not allowed', done => {
            itemData.status = 'maybe';
            const item = new Item(itemData);

            item.validate(err => {
                expect(err.errors['status']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('trims the whitespace around the clientId field', () => {
            itemData.clientId = '  12345678     ';
            const item = new Item(itemData);
            expect(item.clientId).to.equal('12345678');
        });

        it('trims the whitespace around the urgency field', () => {
            itemData.urgency = '  important     ';
            const item = new Item(itemData);
            expect(item.urgency).to.equal('important');
        });

        it('trims the whitespace around the status field', () => {
            itemData.status = '  approved     ';
            const item = new Item(itemData);
            expect(item.status).to.equal('approved');
        });

        it('transforms the urgency field to lowercase', () => {
            itemData.urgency = 'Important';
            const item = new Item(itemData);
            expect(item.urgency).to.equal('important');
        });

        it('transforms the status field to lowercase', () => {
            itemData.status = 'APPROVED';
            const item = new Item(itemData);
            expect(item.status).to.equal('approved');
        });

        it('transforms the location field to lowercase', () => {
            const item = new Item(itemData);
            expect(item.location).to.equal('rainier house');
        });
    });

    describe('defaults', () => {
        it("urgency to 'important'", () => {
            const item = new Item(itemData);
            expect(item.urgency).to.equal('important');
        });

        it("status to 'active'", () => {
            const item = new Item(itemData);
            expect(item.status).to.equal('active');
        });
    });
});
