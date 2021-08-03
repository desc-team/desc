import mongoose from 'mongoose';

import Item from '../baseitem-model';

const Schema = mongoose.Schema;

const HYGIENE_ITEMS = [
    'soap',
    'shampoo',
    'conditioner',
    'brush/comb',
    'toothbrush',
    'toothpaste',
    'floss',
    'feminine pad',
    'tampons',
    'toilet paper'
];

const options = {
    discriminatorKey: 'itemCategory',
    timestamps: true
};

const personaHygieneSchema = new Schema(
    {
        name: { type: String, trim: true, lowercase: true, enum: HYGIENE_ITEMS, required: true }
    },
    options
);

const PersonalHygiene = Item.discriminator('PersonalHygiene', personaHygieneSchema);

export default PersonalHygiene;
