import mongoose from 'mongoose';
import { expect } from 'chai';
import TicketItem from './ticket-model';
import { ticketItemData } from '../../utils/item-test-utils';

mongoose.Promise = global.Promise;

describe('Ticket item model', () => {
    describe('field validations', () => {
        it('is valid when all required fields are provided', done => {
            const item = new TicketItem(ticketItemData);

            item.validate(err => {
                expect(err).to.not.exist;
                done();
            });
        });
        it('is invalid if the clientId field is empty', done => {
            const data = Object.assign({}, ticketItemData);
            delete data.clientId;
            const item = new TicketItem(data);

            item.validate(err => {
                expect(err.errors['clientId']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the clientRequest field is empty', done => {
            const data = Object.assign({}, ticketItemData);
            delete data.clientRequest;
            const item = new TicketItem(data);

            item.validate(err => {
                expect(err.errors['clientRequest']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the submittedBy field is empty', done => {
            const data = Object.assign({}, ticketItemData);
            delete data.submittedBy;
            const item = new TicketItem(data);

            item.validate(err => {
                expect(err.errors['submittedBy']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });

        it('is invalid if the name field is empty', done => {
            const data = Object.assign({}, ticketItemData);
            delete data.name;
            const item = new TicketItem(data);

            item.validate(err => {
                expect(err.errors['name']).to.exist;
                expect(err.name).to.equal('ValidationError');
                done();
            });
        });
    });

    describe('itemCategory', () => {
        it('is set to Ticket', () => {
            const item = new TicketItem(ticketItemData);
            expect(item.itemCategory).to.equal('Ticket');
        });
    });
});
