import bcrypt from 'bcryptjs';
import { v4 } from 'uuid';
import User from '../entity/User';
import { getRepository } from 'typeorm';
import { UserFields, UpdatableUserFields, UserRole } from '../common/types';
import DateUtils from '../common/DateUtils';

export default class UserService {
    // reduce the hash salt length for tests to decrease the test run time
    static saltLength = process.env.NODE_ENV === 'testing' ? 4 : 12;

    static async createUser(userData: UserFields): Promise<User> {
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

        const user = User.create(data);
        user.emailVerificationToken = v4();
        return user.save();
    }

    static async createAdminTestUser(userData: UserFields): Promise<User> {
        const { password } = userData;
        const hashedPassword = await bcrypt.hash(password, 4);
        const data: UserFields = {
            ...userData,
            password: hashedPassword,
            roles: [UserRole.ADMIN, UserRole.APPROVER]
        };

        const user = User.create(data);
        user.emailVerificationToken = v4();
        return user.save();
    }

    static getAllUsers(): Promise<User[]> {
        return User.find();
    }

    static getUserById(id: string): Promise<User | undefined> {
        return User.findOne({ where: { id } });
    }

    static getUserByEmail(email: string): Promise<User | undefined> {
        return User.findOne({ where: { email } });
    }

    static async updateUser(id: string, data: UpdatableUserFields): Promise<User | undefined> {
        await User.update({ id }, data);
        return UserService.getUserById(id);
    }

    static async deleteUser(id: string): Promise<User | undefined> {
        const user = await UserService.getUserById(id);
        await User.delete({ id });
        return user;
    }

    static async confirmEmail(token: string): Promise<User | undefined> {
        const user = await User.findOne({ where: { emailVerificationToken: token } });
        return UserService.updateUser(user?.id as string, {
            isEmailVerified: true,
            emailVerificationToken: ''
        });
    }

    static async changePassword(token: string, newPassword: string): Promise<User | undefined> {
        const user = await User.findOne({ where: { passwordResetToken: token } });
        if (user) {
            const now = DateUtils.getCurrentDateTime();
            const isTokenExpired = now > user.passwordResetTokenExpiresAt;
            if (!isTokenExpired) {
                user.password = await bcrypt.hash(newPassword, UserService.saltLength);
                user.passwordResetToken = '';
                user.passwordResetTokenExpiresAt = now;
                user.passwordLastChangedAt = now;

                return user.save();
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
            await user.save();
        }
        return user;
    }

    private static async getUserCount(): Promise<number> {
        const count = await getRepository(User).createQueryBuilder('user').getCount();
        return count;
    }
}
