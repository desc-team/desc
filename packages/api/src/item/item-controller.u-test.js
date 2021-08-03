import { expect } from 'chai';

import * as Controller from './item-controller';

describe('Item Controller', () => {
    describe('createItem()', () => {
        it('returns a rejected promise if item data is not provided', () => {
            const promise = Controller.createItem();
            return promise.catch(err => {
                expect(err).to.exist;
                expect(err.message).to.be.a('string');
                expect(err instanceof Error).to.be.true;
            });
        });
    });

    describe('getItem(id)', () => {
        it('returns a rejected promise if item id is not provided', () => {
            const promise = Controller.getItem();
            return promise.catch(err => {
                expect(err).to.exist;
                expect(err.message).to.be.a('string');
                expect(err instanceof Error).to.be.true;
            });
        });
    });

    describe('updateItem(id, itemData)', () => {
        it('returns a rejected promise if item id is not provided', () => {
            const promise = Controller.updateItem(null, { name: 'cutlery' });
            return promise.catch(err => {
                expect(err).to.exist;
                expect(err.message).to.be.a('string');
                expect(err instanceof Error).to.be.true;
            });
        });
    });

    describe('deleteItem(id)', () => {
        it('returns a rejected promise if item id is not provided', () => {
            const promise = Controller.deleteItem();
            return promise.catch(err => {
                expect(err).to.exist;
                expect(err.message).to.be.a('string');
                expect(err instanceof Error).to.be.true;
            });
        });
    });

    describe('addNote(itemId, noteData)', () => {
        it('returns a rejected promise if item id is not provided', () => {
            const promise = Controller.addNote(null, {
                submittedBy: '5bb69cb1322fdf5690edfc0b',
                body: 'this is a note'
            });
            return promise.catch(err => {
                expect(err).to.exist;
                expect(err.message).to.be.a('string');
                expect(err instanceof Error).to.be.true;
            });
        });

        it('returns a rejected promise if note data is not provided', () => {
            const promise = Controller.addNote('5bca0257b2f5ce2c899c08d3');
            return promise.catch(err => {
                expect(err).to.exist;
                expect(err.message).to.be.a('string');
                expect(err instanceof Error).to.be.true;
            });
        });
    });
});
