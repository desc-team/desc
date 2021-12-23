import M from 'materialize-css';
import { useEffect, useState } from 'react';
import NoteDetails from './NoteDetails';
import AddNoteForm from './AddNoteForm';
import { inboxStyles as css, initCollapsibleElements } from './utils';

const ListHeader = () => {
    return (
        <li>
            <div className="teal-text text-darken-3" style={css.listHeader}>
                <p style={css.flexItem}>Client ID</p>
                <p style={css.flexItem}>Item</p>
                <p style={css.flexItem}>Quantity</p>
                <p style={css.flexItem}>Request Date</p>
            </div>
        </li>
    );
};

const RequestorItemList = ({ items, filter }) => {
    const [displayableItems, setDisplayableItems] = useState([]);

    useEffect(() => {
        initCollapsibleElements(M);
    }, []);

    useEffect(() => {
        setDisplayableItems(items.filter((item) => item.status === filter));
    }, [items, filter]);

    const handleNoteAdd = (itemId, itemData) => {
        setDisplayableItems(
            displayableItems.map((item) => {
                if (item.id === itemId) {
                    return {
                        ...item,
                        updatedAt: itemData.updatedAt,
                        notes: [...itemData.notes]
                    };
                }
                return {
                    ...item
                };
            })
        );
    };

    return (
        <ul className="collapsible expandable">
            <ListHeader />
            {displayableItems &&
                displayableItems.map((item) => {
                    return (
                        <li key={item.id}>
                            <div className="collapsible-header" style={css.itemHeader}>
                                <p style={css.flexItem}>{item.clientId}</p>
                                <p style={css.flexItemCapitialize}>{item.name}</p>
                                <p style={css.flexItem}>{item.quantity}</p>
                                <p style={css.flexItem}>
                                    {new Date(item.createdAt).toDateString()}
                                </p>
                            </div>
                            <div className="collapsible-body">
                                <p style={{ fontSize: '1.125rem', marginBottom: '.5rem' }}>
                                    Notes:
                                </p>
                                {item.notes.map((note) => (
                                    <NoteDetails key={note.id} note={note} />
                                ))}
                                <AddNoteForm itemId={item.id} onNoteAdd={handleNoteAdd} />
                            </div>
                        </li>
                    );
                })}

            {(!displayableItems || displayableItems.length === 0) && (
                <li>
                    <div style={{ padding: '1rem' }}>No items available</div>
                </li>
            )}
        </ul>
    );
};

export default RequestorItemList;
