import { ItemCategory } from './enums';
import { BaseItemFields } from './items';

// Engagement Items
export const availableEngagementItems = ['games', 'artwork', 'candy/treats', 'other'] as const;

export type EngagementItems = typeof availableEngagementItems[number];

export interface EngagementItemFields extends BaseItemFields {
    category: ItemCategory.ENGAGEMENT;
    name: EngagementItems;
}
