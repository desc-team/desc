import { Program, UserRole } from './enums';

export interface UserFields {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    program?: Program;
    roles?: UserRole[];
    isEmailVerified?: boolean;
    emailVerificationToken?: string;
    isActive?: boolean;
}

export type UpdatableUserFields = Partial<Omit<UserFields, 'password' | 'roles'>>;
