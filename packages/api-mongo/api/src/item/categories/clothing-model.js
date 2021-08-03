import mongoose from 'mongoose';

import Item from '../baseitem-model';
import {
    menShirtCoatSizes,
    menPantSizes,
    menShoeSizes,
    womenShirtCoatSizes,
    womenPantSizes,
    womenShoeSizes,
    womenBraSizes,
    socksAndUnderwearSizes
} from './sizes';

const Schema = mongoose.Schema;

const SIZES = {
    M: {
        shirt: menShirtCoatSizes,
        coat: menShirtCoatSizes,
        pants: menPantSizes,
        shoes: menShoeSizes,
        socks: socksAndUnderwearSizes,
        underwear: socksAndUnderwearSizes
    },
    F: {
        shirt: womenShirtCoatSizes,
        coat: womenShirtCoatSizes,
        pants: womenPantSizes,
        bra: womenBraSizes,
        shoes: womenShoeSizes,
        socks: socksAndUnderwearSizes,
        underwear: socksAndUnderwearSizes
    }
};

const CLOTHING_ITEMS = [
    'shirt',
    'pants',
    'coat',
    'shoes',
    'socks',
    'underwear',
    'bra',
    'scarf',
    'hat'
];

const options = {
    discriminatorKey: 'itemCategory',
    timestamps: true
};

const clothingItemSchema = new Schema(
    {
        gender: {
            type: String,
            required: function() {
                return !(this.name == 'hat' || this.name == 'scarf');
            }
        },
        name: { type: String, lowercase: true, trim: true, enum: CLOTHING_ITEMS, required: true },
        size: {
            type: String,
            // size not required for hats or scarfs
            required: function() {
                return !(this.name == 'hat' || this.name == 'scarf');
            }
        },
        style: {
            type: String,
            trim: true,
            lowercase: true,
            enum: ['casual', 'dress'],
            default: 'casual'
        }
    },
    options
);

clothingItemSchema.path('size').validate(function(v) {
    if (!(this.name == 'hat' || this.name == 'scarf')) {
        const sizing = SIZES[this.gender];
        return sizing[this.name].includes(v);
    }
    return true;
});

clothingItemSchema.path('gender').validate(function(v) {
    if (!(this.name == 'hat' || this.name == 'scarf')) {
        return ['M', 'F'].includes(v);
    }
    return true;
});

clothingItemSchema.path('name').validate(function(v) {
    if (v == 'bra' && this.gender != 'F') {
        return false;
    }
    return true;
});

const Clothing = Item.discriminator('Clothing', clothingItemSchema);

export default Clothing;
