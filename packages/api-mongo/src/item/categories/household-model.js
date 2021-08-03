import mongoose from 'mongoose';

import Item from '../baseitem-model';

const Schema = mongoose.Schema;

const HOUSEHOLD_ITEMS = [
    'bedding',
    'pillow',
    'plates',
    'cutlery',
    'pots and pans',
    'napkins/paper towels',
    'shower curtain'
];

const options = {
    discriminatorKey: 'itemCategory',
    timestamps: true
};

const householdItemSchema = new Schema(
    {
        name: { type: String, trim: true, lowercase: true, enum: HOUSEHOLD_ITEMS, required: true }
    },
    options
);

const Household = Item.discriminator('Household', householdItemSchema);

export default Household;
