import { ItemCategory } from './enums';
import { BaseItemFields } from './items';

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

export interface PersonalHygieneFields extends BaseItemFields {
    category: ItemCategory.PERSONAL_HYGIENE;
    name: PersonalHygieneItems;
}
