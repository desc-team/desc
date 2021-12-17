import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import User from '../entity/User';
import { UserFields, UpdatableUserFields } from '../common/types/user';
import { UserRole } from '../common/types/enums';
import DateUtils from '../common/DateUtils';
import { getEntityManager } from '../common/entityUtils';

export default class UserService {
    // reduce the hash salt length for tests to decrease the test run time
    static saltLength = process.env.NODE_ENV === 'testing' ? 4 : 12;

    static async createUser(userData: UserFields): Promise<User> {
        const em = getEntityManager();
        const { password } = userData;

        const hashedPassword = await bcrypt.hash(password, UserService.saltLength);
        let data: UserFields = { ...userData, password: hashedPassword };

        // for dev purposes, let's make the first user created an 'admin' & 'approver';
        // all subsequent users will default to a 'requestor'
        if (
            (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testingE2E') &&
            (await UserService.getUserCount()) === 0
        ) {
            data = { ...data, roles: [UserRole.ADMIN, UserRole.APPROVER] };
        }

        const user = em.create(User, data);
        user.emailVerificationToken = v4();
        return em.save(user);
    }

    static async createAdminTestUser(userData: UserFields): Promise<User> {
        const em = getEntityManager();
        const { password } = userData;
        const hashedPassword = await bcrypt.hash(password, 4);
        const data: UserFields = {
            ...userData,
            password: hashedPassword,
            roles: [UserRole.ADMIN, UserRole.APPROVER]
        };

        const user = em.create(User, data);
        user.emailVerificationToken = v4();
        return em.save(user);
    }

    static getAllUsers(): Promise<User[]> {
        return getEntityManager().find(User);
    }

    static getUserById(id: string): Promise<User | undefined> {
        return getEntityManager().findOne(User, { where: { id } });
    }

    static getUserByEmail(email: string): Promise<User | undefined> {
        return getEntityManager().findOne(User, { where: { email } });
    }

    static async updateUser(id: string, data: UpdatableUserFields): Promise<User | undefined> {
        await getEntityManager().update(User, { id }, data);
        return UserService.getUserById(id);
    }

    static async deleteUser(id: string): Promise<User | undefined> {
        const user = await UserService.getUserById(id);
        await getEntityManager().delete(User, { id });
        return user;
    }

    static async setIsActive(id: string, isUserActive: boolean): Promise<User | undefined> {
        return UserService.updateUser(id, { isActive: isUserActive });
    }

    static async confirmEmail(token: string): Promise<User | undefined> {
        const user = await getEntityManager().findOne(User, {
            where: { emailVerificationToken: token }
        });
        return UserService.updateUser(user?.id as string, {
            isEmailVerified: true,
            emailVerificationToken: ''
        });
    }

    static async changePassword(token: string, newPassword: string): Promise<User | undefined> {
        const em = getEntityManager();
        const user = await em.findOne(User, { where: { passwordResetToken: token } });
        if (user) {
            const now = DateUtils.getCurrentDateTime();
            const isTokenExpired = now > user.passwordResetTokenExpiresAt;
            if (!isTokenExpired) {
                user.password = await bcrypt.hash(newPassword, UserService.saltLength);
                user.passwordResetToken = '';
                user.passwordResetTokenExpiresAt = now;
                user.passwordLastChangedAt = now;

                return em.save(user);
            } else {
                throw new Error('password reset token is expired');
            }
        } else {
            return undefined;
        }
    }

    static async generatePasswordResetToken(email: string): Promise<User | undefined> {
        const user = await UserService.getUserByEmail(email);
        if (user) {
            const in2hrs = DateUtils.getDateMinutesFromNow(120);
            user.passwordResetToken = v4();
            user.passwordResetTokenExpiresAt = in2hrs;
            await getEntityManager().save(user);
        }
        return user;
    }

    private static async getUserCount(): Promise<number> {
        const count = await getEntityManager().count(User);
        return count;
    }
}
