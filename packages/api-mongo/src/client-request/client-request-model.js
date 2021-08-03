import mongoose from 'mongoose';
import { Item } from '../models';

const Schema = mongoose.Schema;

const clientRequestSchema = new Schema(
    {
        clientId: { type: String, trim: true, required: true },
        submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: [{ type: Schema.Types.ObjectId, ref: 'Item' }]
    },
    { timestamps: true }
);

clientRequestSchema.post('remove', (request, next) => {
    cascadeDeleteItems(request).then(() => next());
});

const cascadeDeleteItems = deletedRequest =>
    Item.deleteMany({ clientRequest: deletedRequest._id }).exec();

const ClientRequest = mongoose.model('ClientRequest', clientRequestSchema);

export default ClientRequest;
