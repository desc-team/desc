import mongoose from 'mongoose';

import Item from '../baseitem-model';

const Schema = mongoose.Schema;

const ENGAGEMENT_ITEMS = ['artwork', 'candy/edible treats', 'games'];

const options = {
    discriminatorKey: 'itemCategory',
    timestamps: true
};

const engagementItemSchema = new Schema(
    {
        name: { type: String, trim: true, lowercase: true, enum: ENGAGEMENT_ITEMS, required: true }
    },
    options
);

const Engagement = Item.discriminator('Engagement', engagementItemSchema);

export default Engagement;
