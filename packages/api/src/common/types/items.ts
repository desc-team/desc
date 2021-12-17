import {
    ClothingBraFields,
    ClothingGlovesFields,
    ClothingPantFields,
    ClothingShirtOrCoatFields,
    ClothingShoeFields,
    ClothingSockOrUnderwearFields
} from './clothingItems';
import { HouseholdItemFields } from './householdItems';
import { HouseLocation, ItemPriority, ItemStatus } from './enums';
import { EngagementItemFields } from './engagementItems';
import { PersonalHygieneFields } from './personalHygieneItems';
import { PetFields } from './petItems';
import { TicketFields } from './ticketItems';
import { OtherFields } from './otherItems';

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
