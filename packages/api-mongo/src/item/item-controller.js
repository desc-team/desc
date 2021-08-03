import Item from './baseitem-model';
import HouseholdItem from './categories/household-model';
import EngagementItem from './categories/engagement-model';
import ClothingItem from './categories/clothing-model';
import PersonalHygieneItem from './categories/personalhygiene-model';
import TicketItem from './categories/ticket-model';
import PetItem from './categories/pet-model';
import Note from '../note/note-model';

const optionsToPopulateNote = {
    path: 'notes',
    select: 'body',
    populate: { path: 'submittedBy', select: 'name' }
};

const optionsToPopulateSubmittedBy = {
    path: 'submittedBy',
    select: 'name email'
};

export const createItem = itemData => {
    if (!itemData) {
        return Promise.reject(new Error('item data is required'));
    }

    let newItem;
    switch (itemData.itemCategory) {
        case 'Clothing':
        case 'clothing':
            newItem = new ClothingItem(itemData);
            break;
        case 'Household':
        case 'household':
            newItem = new HouseholdItem(itemData);
            break;
        case 'Engagement':
        case 'engagement':
            newItem = new EngagementItem(itemData);
            break;
        case 'PersonalHygiene':
        case 'personalHygiene':
            newItem = new PersonalHygieneItem(itemData);
            break;
        case 'Ticket':
        case 'ticket':
            newItem = new TicketItem(itemData);
            break;
        case 'Pet':
        case 'pet':
            newItem = new PetItem(itemData);
            break;
        default:
            return Promise.reject(new Error('item category is not provided'));
    }

    if (itemData.note) {
        let newNote = new Note();
        newNote.itemId = newItem._id;
        newNote.submittedBy = newItem.submittedBy;
        newNote.body = itemData.note;
        return newNote
            .save()
            .then(note => newItem.notes.push(note._id))
            .then(() => newItem.save())
            .then(item =>
                item
                    .populate(optionsToPopulateNote)
                    .populate(optionsToPopulateSubmittedBy)
                    .execPopulate()
            );
    } else {
        return newItem
            .save()
            .then(item => item.populate(optionsToPopulateSubmittedBy).execPopulate());
    }
};

export const getItems = (query = {}) => {
    return Item.find(query)
        .populate(optionsToPopulateSubmittedBy)
        .populate(optionsToPopulateNote)
        .exec();
};

export const getItem = id => {
    if (!id) {
        return Promise.reject(new Error('item id is required'));
    }
    return Item.findById(id)
        .populate(optionsToPopulateSubmittedBy)
        .populate(optionsToPopulateNote)
        .exec();
};

export const updateItem = (id, itemData = {}) => {
    if (!id) {
        return Promise.reject(new Error('item id is required'));
    }
    return Item.findById(id)
        .exec()
        .then(item => {
            Object.assign(item, itemData);
            return item.save().then(item =>
                item
                    .populate(optionsToPopulateNote)
                    .populate(optionsToPopulateSubmittedBy)
                    .execPopulate()
            );
        });
};

export const deleteItem = id => {
    if (!id) {
        return Promise.reject(new Error('item id is required'));
    }
    return Item.findById(id)
        .exec()
        .then(item => {
            return item.remove();
        });
};

export const addNote = (itemId, noteData) => {
    if (!itemId) {
        return Promise.reject(new Error('item id is required'));
    }
    if (!noteData) {
        return Promise.reject(new Error('note data is required'));
    }
    return Item.findById(itemId)
        .exec()
        .then(item => {
            let newNote = new Note(noteData);
            newNote.itemId = item._id;
            return newNote
                .save()
                .then(note => item.notes.push(note._id))
                .then(() => item.save())
                .then(item =>
                    item
                        .populate(optionsToPopulateNote)
                        .populate(optionsToPopulateSubmittedBy)
                        .execPopulate()
                );
        });
};
