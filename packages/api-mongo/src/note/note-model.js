import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const noteSchema = new Schema(
    {
        itemId: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
        submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        body: { type: String, required: true }
    },
    { timestamps: true }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;
