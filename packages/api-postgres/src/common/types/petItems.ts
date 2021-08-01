import { ItemCategory } from './enums';
import { BaseItemFields } from './items';

// Pet Items
export const availablePetItems = ['other'] as const;

export type PetItems = typeof availablePetItems[number];
export interface PetFields extends BaseItemFields {
    category: ItemCategory.PET;
    name: PetItems;
}
