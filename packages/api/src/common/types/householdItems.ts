import { ItemCategory } from './enums';
import { BaseItemFields } from './items';

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

export interface HouseholdItemFields extends BaseItemFields {
    category: ItemCategory.HOUSEHOLD;
    name: HouseholdItems;
}
