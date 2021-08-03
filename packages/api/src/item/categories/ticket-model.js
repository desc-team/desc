import mongoose from 'mongoose';

import Item from '../baseitem-model';

const Schema = mongoose.Schema;

const options = {
    discriminatorKey: 'itemCategory',
    timestamps: true
};

const ticketItemSchema = new Schema({
    name: { type: String, trim: true, lowercase: true, required: true }
});

const Ticket = Item.discriminator('Ticket', ticketItemSchema);

export default Ticket;
