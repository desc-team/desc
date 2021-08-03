import { expect } from 'chai';
import sinon from 'sinon';
import 'sinon-mongoose';

import * as Controller from './client-request-controller';
import * as ItemController from '../item/item-controller';
import ClientRequest from './client-request-model';

//#region mock data
const requestorId = '5bf757c509ad206db5bb525d';
const mockClientRequest = {
    __v: 0,
    _id: '5bf757c709ad206db5bb5262',
    clientId: '12345678',
    submittedBy: requestorId,
    createdAt: '2018-11-23T01:28:40.701Z',
    updatedAt: '2018-11-23T01:28:40.701Z',
    items: ['5bf757c709ad206db5bb5263', '5bf757c709ad206db5bb5265']
};

const mockItem1 = {
    __v: 0,
    _id: '5bf757c709ad206db5bb5263',
    clientId: '12345678',
    clientRequest: '5bf757c709ad206db5bb5262',
    submittedBy: requestorId,
    itemCategory: 'Household',
    numberOfItems: 4,
    name: 'plates',
    note: 'Need some plates for a nice holiday dinner'
};

const mockItem2 = {
    __v: 0,
    _id: '5bf757c709ad206db5bb5265',
    clientId: '12345678',
    clientRequest: '5bf757c709ad206db5bb5262',
    submittedBy: requestorId,
    itemCategory: 'Clothing',
    numberOfItems: 1,
    name: 'coat',
    size: 'L (42-44)',
    gender: 'M',
    note: 'Need a warm coat for the fall season'
};
//#endregion

describe('Client Request Controller', () => {
    describe('createClientRequest()', () => {
        let ClientRequestMock;
        beforeEach(() => {
            ClientRequestMock = sinon.mock(ClientRequest);
        });

        afterEach(() => {
            ClientRequestMock.restore();
        });

        it('calls createItem for each item provided in "items"', () => {
            const item1 = {
                clientId: '12345678',
                clientRequest: '5bf757c709ad206db5bb5262',
                submittedBy: requestorId,
                itemCategory: 'Household',
                numberOfItems: 4,
                name: 'plates',
                note: 'Need some plates for a nice holiday dinner'
            };

            const item2 = {
                clientId: '12345678',
                clientRequest: '5bf757c709ad206db5bb5262',
                submittedBy: requestorId,
                itemCategory: 'Clothing',
                numberOfItems: 1,
                name: 'coat',
                size: 'L (42-44)',
                gender: 'M',
                note: 'Need a warm coat for the fall season'
            };

            const clientReqData = {
                clientId: '12345678',
                submittedBy: requestorId,
                items: [item1, item2]
            };
            const saveStub = sinon
                .stub(ClientRequest.prototype, 'save')
                .resolves(new ClientRequest(mockClientRequest));

            const populateStub = sinon
                .stub(ClientRequest.prototype, 'populate')
                .returns(new ClientRequest(mockClientRequest));

            const execPopulateStub = sinon
                .stub(ClientRequest.prototype, 'execPopulate')
                .resolves(mockClientRequest);

            const createItemStub = sinon.stub(ItemController, 'createItem');

            createItemStub.onFirstCall().resolves(mockItem1);
            createItemStub.onSecondCall().resolves(mockItem2);

            const promise = Controller.createClientRequest(clientReqData);
            expect(promise).to.be.a('promise');
            return promise.then(request => {
                expect(createItemStub.calledTwice).to.be.true;
                saveStub.restore();
                populateStub.restore();
                execPopulateStub.restore();
                createItemStub.restore();
            });
        });

        it('rejects if the client request data is not provided', () => {
            const promise = Controller.createClientRequest();
            expect(promise).to.be.a('promise');
            promise.catch(error => {
                expect(error).to.exist;
                expect(error.message).to.contain('client request data is required');
            });
        });
    });
});
