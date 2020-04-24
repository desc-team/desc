import { createPostgresConnection, closeConnection } from '../../config/database';
import User, { Program } from '../../entity/User';
import { ItemCategory, HouseLocation, ItemData } from '../../item/types';
import UserService from '../../user/UserService';
import ClientRequestService from '../ClientRequestService';
import TestUtils from '../../testUtils/TestUtilities';

describe('ClientRequest service', () => {
    let userId: string;
    const clientId = '123456789';
    let item1: ItemData;
    let item2: ItemData;
    beforeAll(async () => {
        await createPostgresConnection();
        userId = (
            await UserService.createUser(
                'Test',
                'User',
                'test@desc.org',
                '123456',
                Program.SURVIVAL
            )
        ).id;

        item1 = {
            clientId,
            category: ItemCategory.HOUSEHOLD,
            name: 'pillows',
            quantity: 2,
            location: HouseLocation.RAINIER_HOUSE,
            requestorId: userId
        };

        item2 = {
            clientId,
            category: ItemCategory.ENGAGEMENT,
            name: 'games',
            location: HouseLocation.AURORA_HOUSE,
            requestorId: userId,
            note: 'Board games are perfect'
        };
    });

    afterEach(async () => {
        await TestUtils.dropNotes();
        await TestUtils.dropItems();
        await TestUtils.dropClientRequests();
    });

    afterAll(async () => {
        await TestUtils.dropUsers();
        await closeConnection();
    });

    describe('createClientRequest() method', () => {
        it('creates a client request without any items', async () => {
            const cr = await ClientRequestService.createClientRequest({
                clientId,
                requestorId: userId
            });

            expect(cr).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId: expect.any(String),
                    submittedBy: expect.any(User),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                })
            );

            expect(cr).toEqual(expect.not.objectContaining({ items: expect.any(Object) }));
        });

        it('creates a client request when passed a single item', async () => {
            const cr = await ClientRequestService.createClientRequest({
                clientId,
                requestorId: userId,
                items: item2
            });

            expect(cr).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId: expect.any(String),
                    submittedBy: expect.any(User),
                    items: expect.arrayContaining([expect.any(Object)]),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                })
            );

            expect(cr.items).toHaveLength(1);
        });

        it('creates a client request when passed an array of items', async () => {
            const cr = await ClientRequestService.createClientRequest({
                clientId,
                requestorId: userId,
                items: [item1, item2]
            });

            expect(cr).toEqual(
                expect.objectContaining({
                    id: expect.any(String),
                    clientId: expect.any(String),
                    submittedBy: expect.any(User),
                    items: expect.arrayContaining([expect.any(Object)]),
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                })
            );

            expect(cr.items).toHaveLength(2);
        });

        it('throws an error if the requestor is not found', async () => {
            expect.assertions(1);
            const unkownUserId = '4a29f793-ad0f-4388-9a40-0c0423c5b78c';

            try {
                await ClientRequestService.createClientRequest({
                    clientId,
                    requestorId: unkownUserId,
                    items: item1
                });
            } catch (e) {
                expect(e.message).toBe('Invalid requestor');
            }
        });
    });

    describe('getAllClientRequests() method', () => {
        beforeEach(async () => {
            await ClientRequestService.createClientRequest({
                clientId,
                requestorId: userId,
                items: [item1, item2]
            });
        });

        it('fetches all the client requests', async () => {
            const requests = await ClientRequestService.getAllClientRequests();

            expect(requests).toHaveLength(1);
            expect(requests).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        clientId: expect.any(String),
                        submittedBy: expect.any(User),
                        items: expect.arrayContaining([expect.any(Object), expect.any(Object)]),
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date)
                    })
                ])
            );
        });
    });
});
