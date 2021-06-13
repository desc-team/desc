import {
    availableBraSizes,
    availableGloveSizes,
    availablePantSizes,
    availableShirtOrCoatSizes,
    availableShoeSizes,
    availableSockOrUnderwearSizes,
    BraSizes,
    GloveSizes,
    PantSizes,
    ShirtOrCoatSizes,
    ShoeSizes,
    SockOrUnderwearSizes
} from '../common/types/clothingItemSizes';
import {
    availableClothingItems,
    availableEngagementItems,
    availableHouseholdItems,
    availableOtherItems,
    availablePersonalHygieneItems,
    availablePetItems,
    availableTicketItems,
    ClothingItems,
    EngagementItems,
    HouseholdItems,
    OtherItems,
    PersonalHygieneItems,
    PetItems,
    TicketItems
} from '../common/types/types';

const fieldsToNormalize = ['category', 'name', 'location', 'priority', 'status'];

function isItemValid<T extends string>(item: string, items: any): item is T {
    return items.includes(item as T);
}

// add an alias
const isSizeValid = isItemValid;

export function normalizeData(payload: Record<string, any>): any {
    const data: Record<string, any> = {};

    for (const key in payload) {
        if (typeof payload[key] === 'string' && fieldsToNormalize.includes(key)) {
            data[key] = payload[key].toLowerCase();
        } else {
            data[key] = payload[key];
        }
    }
    return data;
}

export function isValidItemForCategory(category: string, item: string): boolean {
    let result = false;
    switch (category) {
        case 'clothing':
            if (isItemValid<ClothingItems>(item, availableClothingItems)) {
                result = true;
            }
            break;
        case 'engagement':
            if (isItemValid<EngagementItems>(item, availableEngagementItems)) {
                result = true;
            }
            break;
        case 'household':
            if (isItemValid<HouseholdItems>(item, availableHouseholdItems)) {
                result = true;
            }
            break;
        case 'personal hygiene':
            if (isItemValid<PersonalHygieneItems>(item, availablePersonalHygieneItems)) {
                result = true;
            }
            break;
        case 'pet':
            if (isItemValid<PetItems>(item, availablePetItems)) {
                result = true;
            }
            break;
        case 'ticket':
            if (isItemValid<TicketItems>(item, availableTicketItems)) {
                result = true;
            }
            break;
        case 'other':
            if (isItemValid<OtherItems>(item, availableOtherItems)) {
                result = true;
            }
            break;
        default:
            break;
    }
    return result;
}

export function isValidSizeForItem(itemName: string, size: string): boolean {
    let result = false;
    switch (itemName) {
        case 'shirt':
        case 'coat':
            if (isSizeValid<ShirtOrCoatSizes>(size, availableShirtOrCoatSizes)) {
                result = true;
            }
            break;

        case 'pants':
            if (isSizeValid<PantSizes>(size, availablePantSizes)) {
                result = true;
            }
            break;

        case 'shoes':
            if (isSizeValid<ShoeSizes>(size, availableShoeSizes)) {
                result = true;
            }
            break;

        case 'socks':
        case 'underwear':
            if (isSizeValid<SockOrUnderwearSizes>(size, availableSockOrUnderwearSizes)) {
                result = true;
            }
            break;

        case 'bra':
            if (isSizeValid<BraSizes>(size, availableBraSizes)) {
                result = true;
            }
            break;

        case 'gloves':
            if (isSizeValid<GloveSizes>(size, availableGloveSizes)) {
                result = true;
            }
            break;

        case 'hat':
        case 'scarf':
            if (size === null || size === undefined || size === '') {
                result = true;
            }
            break;

        default:
            break;
    }
    return result;
}
