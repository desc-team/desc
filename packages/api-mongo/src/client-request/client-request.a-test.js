import { expect } from 'chai';
import request from 'supertest';

import app from '../config/app';
import config from '../config/config';
import { createClientRequest } from './client-request-controller';
import { User, ClientRequest, Item, Note } from '../models';
import { createUserAndGetToken, userBarry } from '../utils/user-test-utils';
import { dbConnection, deleteCollection } from '../utils/db-test-utils';
import { getMockItemData } from '../utils/item-test-utils';

const AUTH_COOKIE_NAME = config.authCookieName;

describe('Client Request acceptance tests', () => {
    let barryId;
    let token;
    before(async () => {
        await deleteCollection(dbConnection, User, 'users');
        return createUserAndGetToken(userBarry).then(data => {
            barryId = data.user._id;
            token = data.token;
        });
    });

    afterEach(async () => {
        await deleteCollection(dbConnection, Item, 'items');
        await deleteCollection(dbConnection, Note, 'notes');
        await deleteCollection(dbConnection, ClientRequest, 'clientrequests');
    });

    after(async () => await deleteCollection(dbConnection, User, 'users'));

    context('POST /api/clientrequests', () => {
        it('creates a new client request when provided an array of requested items', () => {
            const item1 = getMockItemData(barryId).householdItemWithoutNote;
            const item2 = getMockItemData(barryId).clothingItemWithNote;
            const clientRequestData = {
                clientId: '12345678',
                submittedBy: barryId,
                items: [item1, item2]
            };

            return request
                .agent(app)
                .post('/api/clientrequests/')
                .set('Cookie', [`${AUTH_COOKIE_NAME}=${token}`])
                .send(clientRequestData)
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;

                    const clientRequest = res.body.payload.clientRequest;
                    expect(clientRequest).to.exist;
                    expect(clientRequest).to.have.property('items');
                    expect(clientRequest.items).to.be.an('array');
                    expect(clientRequest.items).to.have.length(2);
                });
        });

        it('creates a new client request when provided an single requested item', () => {
            const item = getMockItemData(barryId).householdItemWithoutNote;
            const clientRequestData = {
                clientId: '12345678',
                submittedBy: barryId,
                items: item
            };

            return request
                .agent(app)
                .post('/api/clientrequests/')
                .set('Cookie', [`${AUTH_COOKIE_NAME}=${token}`])
                .send(clientRequestData)
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;

                    const clientRequest = res.body.payload.clientRequest;
                    expect(clientRequest).to.exist;
                    expect(clientRequest).to.have.property('items');
                    expect(clientRequest.items).to.be.an('array');
                    expect(clientRequest.items).to.have.length(1);
                });
        });

        it('creates a new empty client request when no items are provided', () => {
            const clientRequestData = {
                clientId: '12345678',
                submittedBy: barryId
            };

            return request
                .agent(app)
                .post('/api/clientrequests/')
                .set('Cookie', [`${AUTH_COOKIE_NAME}=${token}`])
                .send(clientRequestData)
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;

                    const clientRequest = res.body.payload.clientRequest;
                    expect(clientRequest).to.exist;
                    expect(clientRequest).to.have.property('items');
                    expect(clientRequest.items).to.be.an('array');
                    expect(clientRequest.items).to.have.length(0);
                });
        });
    });

    context('GET /api/clientrequests', () => {
        it('returns a json payload with all the client requests', async () => {
            const item1 = getMockItemData(barryId).householdItemWithoutNote;
            const item2 = getMockItemData(barryId).clothingItemWithNote;
            const clientRequestData1 = {
                clientId: '12345678',
                submittedBy: barryId,
                items: [item1, item2]
            };
            const clientRequestData2 = {
                clientId: '87654321',
                submittedBy: barryId,
                items: [item1, item2]
            };

            await createClientRequest(clientRequestData1);
            await createClientRequest(clientRequestData2);

            return request
                .agent(app)
                .get('/api/clientrequests/')
                .set('Cookie', [`${AUTH_COOKIE_NAME}=${token}`])
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;

                    const clientRequests = res.body.payload.clientRequests;
                    expect(clientRequests).to.exist;
                    expect(clientRequests).to.be.an('array');
                    expect(clientRequests).to.have.length(2);
                });
        }).timeout(4000);
    });

    context('GET /api/clientrequests/:id', () => {
        let clientRequestId;
        before(() => {
            const item1 = getMockItemData(barryId).householdItemWithoutNote;
            const item2 = getMockItemData(barryId).clothingItemWithNote;
            const clientRequestData = {
                clientId: '12345678',
                submittedBy: barryId,
                items: [item1, item2]
            };

            return createClientRequest(clientRequestData).then(
                request => (clientRequestId = request._id)
            );
        });

        it('returns the client request with the given id', () => {
            return request
                .agent(app)
                .get(`/api/clientrequests/${clientRequestId}`)
                .set('Cookie', [`${AUTH_COOKIE_NAME}=${token}`])
                .expect(200)
                .then(res => {
                    const json = res.body;
                    expect(json).to.have.property('success');
                    expect(json).to.have.property('message');
                    expect(json).to.have.property('payload');
                    expect(json.success).to.be.true;

                    const clientRequest = res.body.payload.clientRequest;
                    expect(clientRequest).to.exist;
                    expect(clientRequest).to.be.an('object');
                });
        });
    });
});
