import { Request, Response, NextFunction } from 'express';
import itemService from './ItemService';
import { normalizeData, isValidItemForCategory, isValidSizeForItem } from './itemUtils';

class ItemController {
    createItem(req: Request, res: Response, next: NextFunction): Promise<Response> | void {
        const normalizedData = normalizeData(req.body);

        const {
            clientId,
            category,
            name,
            size,
            priority,
            quantity,
            status,
            location,
            requestorId,
            note
        } = normalizedData;

        const isItemValidForCategory = isValidItemForCategory(category, name);
        if (!isItemValidForCategory) {
            return next(new Error(`Item ${name} is not in category ${category}`));
        }

        if (category === 'clothing') {
            const isSizeValidForItem = isValidSizeForItem(name, size);
            if (!isSizeValidForItem) {
                return next(new Error(`Size ${size} is not valid for ${name}`));
            }
        }

        return itemService
            .createItem({
                clientId,
                category,
                name,
                size,
                priority,
                quantity,
                status,
                location,
                requestorId,
                note
            })
            .then((item) => {
                // need to remove the reference to the item in the note since it causes a circular reference
                // and JSON does not handle it
                if (item && item.notes && item.notes.length > 0) {
                    delete item.notes[0].item;
                }

                return res.status(201).json({
                    success: true,
                    message: 'item created',
                    payload: {
                        item: item?.toClientJSON()
                    }
                });
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error creating new item',
                    payload: {
                        error: err.message,
                        item: null
                    }
                });
            });
    }

    getAllItems(req: Request, res: Response): Promise<Response> {
        return itemService
            .getAllItems(req.query)
            .then((items) => {
                let sanitizedItems;
                if (items) {
                    sanitizedItems = items.map((item) => item.toClientJSON());
                }
                return res.json({
                    success: true,
                    message: 'items fetched',
                    payload: {
                        items: sanitizedItems
                    }
                });
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error fetching items',
                    payload: {
                        error: err.message,
                        items: null
                    }
                });
            });
    }

    getItem(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        return itemService
            .getItemById(id)
            .then((item) => {
                if (item) {
                    return res.json({
                        success: true,
                        message: 'item fetched',
                        payload: { item: item.toClientJSON() }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'item not found',
                        payload: { item: null }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error fetching item',
                    payload: {
                        error: err.message,
                        item: null
                    }
                });
            });
    }

    updateItem(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        const updateData = req.body;
        return itemService
            .updateItem(id, updateData)
            .then((item) => {
                if (item) {
                    return res.json({
                        success: true,
                        message: 'item updated',
                        payload: { item: item.toClientJSON() }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'item not found',
                        payload: { item: null }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error updating item',
                    payload: {
                        error: err.message,
                        item: null
                    }
                });
            });
    }

    deleteItem(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        return itemService
            .deleteItem(id)
            .then((item) => {
                if (item) {
                    return res.json({
                        success: true,
                        message: 'item deleted',
                        payload: { item: item.toClientJSON() }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'item not found',
                        payload: { item: null }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error deleting item',
                    payload: {
                        error: err.message,
                        item: null
                    }
                });
            });
    }

    addNoteToItem(req: Request, res: Response): Promise<Response> {
        const itemId = req.params.id;
        const { body, authorId } = req.body;
        return itemService
            .addNoteToItem({ body, itemId, authorId })
            .then((item) => {
                if (item) {
                    return res.json({
                        success: true,
                        message: 'note added to item',
                        payload: { item: item.toClientJSON() }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'note note added to item',
                        payload: { item: null }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error adding note to item',
                    payload: {
                        error: err.message,
                        item: null
                    }
                });
            });
    }

    deleteNoteFromItem(req: Request, res: Response): Promise<Response> {
        const itemId = req.params.id;
        const noteId = req.params.noteId;

        return itemService
            .deleteNoteFromItem({ noteId, itemId })
            .then((item) => {
                if (item) {
                    return res.json({
                        success: true,
                        message: 'note deleted from item',
                        payload: { item }
                    });
                } else {
                    return res.json({
                        success: false,
                        message: 'unable to delete note from item',
                        payload: { item: null }
                    });
                }
            })
            .catch((err) => {
                return res.json({
                    success: false,
                    message: 'error deleting note from item',
                    payload: {
                        error: err.message,
                        item: null
                    }
                });
            });
    }
}

export default new ItemController();
