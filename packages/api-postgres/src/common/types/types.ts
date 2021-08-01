import {
    ClothingBraFields,
    ClothingGlovesFields,
    ClothingPantFields,
    ClothingShirtOrCoatFields,
    ClothingShoeFields,
    ClothingSockOrUnderwearFields
} from './clothingItems';
import { HouseholdItemFields } from './householdItems';
import { HouseLocation, ItemCategory, ItemPriority, ItemStatus, Program, UserRole } from './enums';
import { EngagementItemFields } from './engagementItems';
import { PersonalHygieneFields } from './personalHygieneItems';
import { PetFields } from './petItems';
import { TicketFields } from './ticketItems';

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

// Other
export const availableOtherItems = ['other'] as const;
export type OtherItems = typeof availableOtherItems[number];
interface OtherFields extends BaseItemFields {
    category: ItemCategory.OTHER;
    name: OtherItems;
}

export interface NoteFields {
    body: string;
    userId?: string;
    itemId?: string;
}

export interface BaseItemFields {
    clientId: string;
    requestorId: string;
    location: HouseLocation;
    size?: string;
    quantity?: number;
    priority?: ItemPriority;
    status?: ItemStatus;
    note?: string;
}

export type ItemFields =
    | ClothingShirtOrCoatFields
    | ClothingPantFields
    | ClothingShoeFields
    | ClothingSockOrUnderwearFields
    | ClothingBraFields
    | ClothingGlovesFields
    | EngagementItemFields
    | HouseholdItemFields
    | PersonalHygieneFields
    | PetFields
    | TicketFields
    | OtherFields;

export type UpdatableItemFields = Partial<ItemFields>;
