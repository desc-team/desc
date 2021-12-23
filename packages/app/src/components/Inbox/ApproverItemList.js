import M from 'materialize-css';
import { useEffect, useState } from 'react';
import useUpdateItem from '../../hooks/useUpdateItem';
import { useQueryClient } from 'react-query';
import NoteDetails from './NoteDetails';
import AddNoteForm from './AddNoteForm';
import { inboxStyles as css, initCollapsibleElements } from './utils';

const ListHeader = () => {
    return (
        <li>
            <div className="teal-text text-darken-3" style={css.listHeader}>
                <p style={css.flexItem}>Requestor</p>
                <p style={css.flexItem}>Item</p>
                <p style={css.flexItem}>Quantity</p>
                <p style={css.flexItem}>Request Date</p>
            </div>
        </li>
    );
};

const ApproverItemList = ({ filter, items }) => {
    const [displayableItems, setDisplayableItems] = useState([]);
    const queryClient = useQueryClient();

    const { updateItem } = useUpdateItem((response) => {
        if (response.success) {
            queryClient.invalidateQueries('items');
        }
    });

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

    const updateItemStatus = (id, status) => {
        updateItem({ itemId: id, itemData: { status } });
    };

    return (
        <ul className="collapsible expandable">
            <ListHeader />
            {displayableItems &&
                displayableItems.map((item) => {
                    return (
                        <li key={item.id}>
                            <div className="collapsible-header" style={css.itemHeader}>
                                <p style={css.flexItem}>
                                    {item.submittedBy.name.first} {item.submittedBy.name.last}
                                </p>
                                <p style={css.flexItemCapitialize}>{item.name}</p>
                                <p style={css.flexItem}>{item.quantity}</p>
                                <p style={css.flexItem}>
                                    {new Date(item.createdAt).toDateString()}
                                </p>
                            </div>
                            <div className="collapsible-body">
                                <div className="actions">
                                    <button
                                        className="btn-small btn-flat"
                                        onClick={() => updateItemStatus(item.id, 'approved')}
                                    >
                                        <i className="material-icons left">check_box</i>
                                        Approve
                                    </button>
                                    <button
                                        className="btn-small btn-flat"
                                        onClick={() => updateItemStatus(item.id, 'denied')}
                                    >
                                        <i className="material-icons left">clear</i>
                                        Reject
                                    </button>
                                    <button
                                        className="btn-small btn-flat"
                                        onClick={() => updateItemStatus(item.id, 'wishlist')}
                                    >
                                        <i className="material-icons left">access_time</i>
                                        Wishlist
                                    </button>
                                    <p style={{ fontSize: '1.125rem', marginBottom: '.5rem' }}>
                                        Notes:
                                    </p>
                                    {item.notes.map((note) => (
                                        <NoteDetails key={note.id} note={note} />
                                    ))}
                                    <AddNoteForm itemId={item.id} onNoteAdd={handleNoteAdd} />
                                </div>
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

export default ApproverItemList;
