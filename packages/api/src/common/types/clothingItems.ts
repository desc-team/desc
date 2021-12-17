import {
    BraSizes,
    GloveSizes,
    PantSizes,
    ShirtOrCoatSizes,
    ShoeSizes,
    SockOrUnderwearSizes
} from './clothingItemSizes';
import { ItemCategory } from './enums';
import { BaseItemFields } from './items';

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

export interface ClothingShirtOrCoatFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'shirt' | 'coat';
    size: ShirtOrCoatSizes;
}

export interface ClothingPantFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'pants';
    size: PantSizes;
}

export interface ClothingShoeFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'shoes';
    size: ShoeSizes;
}

export interface ClothingSockOrUnderwearFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'socks' | 'underwear';
    size: SockOrUnderwearSizes;
}

export interface ClothingBraFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'bra';
    size: BraSizes;
}

export interface ClothingGlovesFields extends BaseItemFields {
    category: ItemCategory.CLOTHING;
    name: 'gloves';
    size: GloveSizes;
}
