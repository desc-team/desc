import mongoose from 'mongoose';

import { Note, ClientRequest } from '../models';

const Schema = mongoose.Schema;

const LOCATIONS = [
    'eastlake',
    'aurora house',
    'canaday house',
    'clement place',
    'cottage grove commons',
    'estelle',
    'evans house',
    'interbay place',
    'kerner-scott house',
    'keys',
    'lyon building',
    'morrison',
    'rainier house',
    'union hotel'
];

const options = {
    discriminatorKey: 'itemCategory',
    timestamps: true
};

const itemSchema = new Schema(
    {
        clientId: { type: String, trim: true, required: true },
        clientRequest: { type: Schema.Types.ObjectId, ref: 'ClientRequest', required: true },
        submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        location: { type: String, trim: true, lowercase: true, enum: LOCATIONS, required: true },
        numberOfItems: { type: Number, default: 1 },
        urgency: {
            type: String,
            trim: true,
            lowercase: true,
            enum: ['survival', 'life-changing', 'important'],
            default: 'important'
        },
        status: {
            type: String,
            trim: true,
            lowercase: true,
            enum: ['active', 'approved', 'wishlist', 'archive', 'denied'],
            default: 'active'
        },
        notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }]
    },
    options
);

itemSchema.post('remove', (deletedItem, next) => {
    Promise.all([
        cascadeDeleteNotes(deletedItem),
        removeDeletedItemFromClientRequest(deletedItem)
    ]).then(() => next());
});

const cascadeDeleteNotes = deletedItem => Note.deleteMany({ itemId: deletedItem._id }).exec();

const removeDeletedItemFromClientRequest = deletedItem =>
    ClientRequest.findById(deletedItem.clientRequest)
        .exec()
        .then(request => {
            if (request) {
                request.items = request.items.filter(itemId => !itemId.equals(deletedItem._id));
                return request.save();
            } else {
                return Promise.resolve();
            }
        });

const Item = mongoose.model('Item', itemSchema);

export default Item;
