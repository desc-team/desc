import { expect } from 'chai';

import * as Controller from './client-request-controller';
import ClientRequest from './client-request-model';
import { createUser } from '../user/user-controller';
import { createItem } from '../item/item-controller';
import { User, Item, Note } from '../models';
import { dbConnection, deleteCollection } from '../utils/db-test-utils';

describe('Client Request integration tests', () => {
    let requestorId = null;
    let item1, item2;
    before(async () => {
        const requestor = await createUser({
            name: {
                first: 'Oliver',
                last: 'Queen'
            },
            email: 'oliver@qc.com',
            program: 'employment',
            password: 'thegreenarrow',
            roles: ['admin', 'approver']
        });

        requestorId = requestor._id;

        item1 = {
            clientId: '12345678',
            submittedBy: requestorId,
            itemCategory: 'Household',
            location: 'Rainier House',
            numberOfItems: 4,
            name: 'plates',
            note: 'Need some plates for a nice holiday dinner'
        };

        item2 = {
            clientId: '12345678',
            submittedBy: requestorId,
            itemCategory: 'Clothing',
            location: 'Rainier House',
            numberOfItems: 1,
            name: 'coat',
            size: 'L (42-44)',
            gender: 'M',
            note: 'Need a warm coat for the fall season'
        };
    });

    afterEach(async () => {
        await deleteCollection(dbConnection, Item, 'items');
        await deleteCollection(dbConnection, Note, 'notes');
        await deleteCollection(dbConnection, ClientRequest, 'clientrequests');
    });

    after(async () => await deleteCollection(dbConnection, User, 'users'));

    describe('createClientRequest()', () => {
        it('creates a client request without any items if none were provided', () => {
            const clientReqData = {
                clientId: '12345678',
                submittedBy: requestorId
            };
            return Controller.createClientRequest(clientReqData).then(request => {
                expect(request).to.be.exist;
                expect(request).to.have.property('clientId');
                expect(request).to.have.property('submittedBy');
                expect(request).to.have.property('items');
                expect(request.items).to.have.length(0);
            });
        });

        it('creates a client request when passed a single item', () => {
            const clientReqData = {
                clientId: '12345678',
                submittedBy: requestorId,
                items: item1
            };

            return Controller.createClientRequest(clientReqData).then(request => {
                expect(request).to.be.exist;
                expect(request).to.have.property('clientId');
                expect(request).to.have.property('submittedBy');
                expect(request).to.have.property('items');
                expect(request.items).to.have.length(1);
            });
        });

        it('creates a client request when passed an array of items', () => {
            const clientReqData = {
                clientId: '12345678',
                submittedBy: requestorId,
                items: [item1, item2]
            };

            return Controller.createClientRequest(clientReqData).then(request => {
                expect(request).to.be.exist;
                expect(request).to.have.property('clientId');
                expect(request).to.have.property('submittedBy');
                expect(request).to.have.property('items');
                expect(request.items).to.have.length(2);
            });
        });
    });

    describe('getClientRequests()', () => {
        it('returns all the client requests', async () => {
            const client1ReqData = {
                clientId: '12345678',
                submittedBy: requestorId,
                items: [item1]
            };
            const client2ReqData = {
                clientId: '87654321',
                submittedBy: requestorId,
                items: [item2]
            };

            await Controller.createClientRequest(client1ReqData);
            await Controller.createClientRequest(client2ReqData);

            return Controller.getClientRequests().then(requests => {
                expect(requests).to.be.an('array');
                expect(requests).to.have.length(2);
            });
        }).timeout(4000);
    });

    describe('getClientRequest()', () => {
        it('returns a client request with the given id', async () => {
            const clientReqData = {
                clientId: '12345678',
                submittedBy: requestorId,
                items: [item1]
            };

            const request = await Controller.createClientRequest(clientReqData);
            const requestId = request._id;

            return Controller.getClientRequest(requestId).then(request => {
                expect(request).to.be.exist;
                expect(request).to.have.property('clientId');
                expect(request).to.have.property('submittedBy');
                expect(request).to.have.property('items');
                expect(request.items).to.be.an('array');
            });
        });
    });
});
