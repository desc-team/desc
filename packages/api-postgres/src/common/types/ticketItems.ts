import { ItemCategory } from './enums';
import { BaseItemFields } from './items';

// Ticket Items
export const availableTicketItems = ['other'] as const;

export type TicketItems = typeof availableTicketItems[number];
export interface TicketFields extends BaseItemFields {
    category: ItemCategory.TICKET;
    name: TicketItems;
}
