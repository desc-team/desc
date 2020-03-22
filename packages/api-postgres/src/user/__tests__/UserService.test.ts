import UserService from '../UserService';
import User, { Program } from '../../entity/User';
import { createPostgresConnection, closeConnection } from '../../config/database';
import TestClient from '../../testUtils/TestClient';

const testUser = {
    firstName: 'John',
    lastName: 'Diggle',
    email: 'john@qc.com',
    password: '123456',
    program: Program.EMPLOYMENT
};

describe('User service integration tests', () => {
    beforeAll(async () => {
        await createPostgresConnection();
    });

    afterAll(async () => {
        await closeConnection();
    });

    describe('createUser method', () => {
        afterEach(async () => {
            await TestClient.deleteUserByEmail('john@qc.com');
        });

        it('creates a new user', async () => {
            const { firstName, lastName, email, password, program } = testUser;
            const result = await UserService.createUser(
                firstName,
                lastName,
                email,
                password,
                program
            );

            expect(result).toEqual(expect.any(User));
            expect(result.password).not.toEqual(testUser.password);
        });
    });

    describe('get[All]User* methods', () => {
        let userId: string;

        beforeEach(async () => {
            const { firstName, lastName, email, password } = testUser;
            const user = await UserService.createUser(firstName, lastName, email, password);
            userId = user.id;
        });

        afterEach(async () => {
            await TestClient.deleteUserByEmail('john@qc.com');
        });

        it('getAllUsers() fetches all the users', async () => {
            const result = await UserService.getAllUsers();

            expect(result).toHaveLength(1);
            expect(result[0]).toEqual(expect.any(User));
        });

        it('getUserById() fetches the user with the given id', async () => {
            const result = await UserService.getUserById(userId);

            expect(result).toEqual(expect.any(User));
        });
    });

    describe('updateUser method', () => {
        let userId: string;

        beforeEach(async () => {
            const { firstName, lastName, email, password } = testUser;
            const user = await UserService.createUser(firstName, lastName, email, password);
            userId = user.id;
        });

        afterEach(async () => {
            await TestClient.deleteUserByEmail('john@qc.com');
            await TestClient.deleteUserByEmail('spartan@qc.com');
        });

        it('returns undefined if user cannot be found with given id', async () => {
            const result = await UserService.updateUser('4157b081-e365-4984-aeac-c31aa255a474', {
                lastName: 'notfound'
            });
            expect(result).toBeUndefined();
        });

        it(`updates user's firstName`, async () => {
            const result = await UserService.updateUser(userId, { firstName: 'Spartan' });
            expect(result?.firstName).toEqual('Spartan');
        });

        it(`updates user's lastName`, async () => {
            const result = await UserService.updateUser(userId, { lastName: 'DC Character' });
            expect(result?.lastName).toEqual('DC Character');
        });

        it(`updates user's email`, async () => {
            const result = await UserService.updateUser(userId, { email: 'spartan@qc.com' });
            expect(result?.email).toEqual('spartan@qc.com');
        });
    });

    describe('deleteUser method', () => {
        let userIdToDelete: string;

        beforeEach(async () => {
            await UserService.createUser('Barry', 'Allen', 'barry@starlabs.com', 'test1234');
            const { firstName, lastName, email, password } = testUser;
            const user = await UserService.createUser(firstName, lastName, email, password);
            userIdToDelete = user.id;
        });

        afterEach(async () => {
            await TestClient.deleteUserByEmail('john@qc.com');
            await TestClient.deleteUserByEmail('barry@starlabs.com');
        });

        it('returns undefined if user cannot be found with given id', async () => {
            const result = await UserService.deleteUser('4157b081-e365-4984-aeac-c31aa255a474');
            expect(result).toBeUndefined();
        });

        it(`deletes the user with the given id`, async () => {
            const result = await UserService.deleteUser(userIdToDelete);
            expect(result?.id).toEqual(userIdToDelete);

            const users = await UserService.getAllUsers();
            expect(users).toHaveLength(1);
        });
    });
});
