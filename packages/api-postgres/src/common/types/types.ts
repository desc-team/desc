import {
    BraSizes,
    GloveSizes,
    PantSizes,
    ShirtOrCoatSizes,
    ShoeSizes,
    SockOrUnderwearSizes
} from './clothingItemSizes';
import { HouseLocation, ItemCategory, ItemPriority, ItemStatus, Program, UserRole } from './enums';

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

// Clothing Items
export const availableClothingItems = [
    'shirt',
    'coat',
    'pants',
    'shoes',
    'socks',
    'underwear',
    'bra',
    'scarf',
    'hats',
    'other'
] as const;
export type ClothingItems = typeof availableClothingItems[number];

interface ClothingShirtOrCoatFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'shirt' | 'coat';
    size: ShirtOrCoatSizes;
}

interface ClothingPantFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'pants';
    size: PantSizes;
}

interface ClothingShoeFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'shoes';
    size: ShoeSizes;
}

interface ClothingSockOrUnderwearFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'socks' | 'underwear';
    size: SockOrUnderwearSizes;
}

interface ClothingBraFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'bra';
    size: BraSizes;
}

interface ClothingGlovesFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'gloves';
    size: GloveSizes;
}

// Engagement Items
export const availableEngagementItems = ['games', 'artwork', 'candy/treats', 'other'] as const;
export type EngagementItems = typeof availableEngagementItems[number];
interface EngagementItemFields extends BaseItemFields {
    category: ItemCategory.ENGAGEMENT;
    name: EngagementItems;
}

// Household Items
export const availableHouseholdItems = [
    'bedding',
    'pillows',
    'plates',
    'cutlery',
    'pots and pans',
    'napkins/paper towels',
    'shower curtain',
    'other'
] as const;
export type HouseholdItems = typeof availableHouseholdItems[number];
interface HouseholdItemFields extends BaseItemFields {
    category: ItemCategory.HOUSEHOLD;
    name: HouseholdItems;
}

// Personal Hygiene Items
export const availablePersonalHygieneItems = [
    'soap',
    'shampoo',
    'conditioner',
    'brush/comb',
    'toothbrush',
    'toothpaste',
    'floss',
    'feminine pad',
    'tampons',
    'toilet paper',
    'other'
] as const;
export type PersonalHygieneItems = typeof availablePersonalHygieneItems[number];
interface PersonalHygieneFields extends BaseItemFields {
    category: ItemCategory.PERSONAL_HYGIENE;
    name: PersonalHygieneItems;
}

// Pet Items
export const availablePetItems = ['other'] as const;
export type PetItems = typeof availablePetItems[number];
interface PetFields extends BaseItemFields {
    category: ItemCategory.PET;
    name: PetItems;
}

// Ticket Items
export const availableTicketItems = ['other'] as const;
export type TicketItems = typeof availableTicketItems[number];
interface TicketFields extends BaseItemFields {
    category: ItemCategory.TICKET;
    name: TicketItems;
}

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

interface BaseItemFields {
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
