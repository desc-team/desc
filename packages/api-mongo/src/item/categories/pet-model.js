import mongoose from 'mongoose';

import Item from '../baseitem-model';

const Schema = mongoose.Schema;

const options = {
    discriminatorKey: 'itemCategory',
    timestamps: true
};

const petItemSchema = new Schema({
    name: { type: String, trim: true, lowercase: true, required: true }
});

const Pet = Item.discriminator('Pet', petItemSchema);

export default Pet;
