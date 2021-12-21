import M from 'materialize-css';
import React, { useEffect, useState } from 'react';
import Spinner from '../Common/Spinner';
import TextField from '../Common/TextField';
import { useAuthContext } from '../../context/AuthContext';
import useItems from '../../hooks/useItems';
import useAddNoteToItem from '../../hooks/useAddNoteToItem';
import useUpdateItem from '../../hooks/useUpdateItem';
import { useQueryClient } from 'react-query';

const css = {
    listHeader: {
        fontWeight: 'bold',
        display: 'flex',
        padding: '1rem 2rem',
        borderBottom: '2px #999 solid'
    },

    flexItem: {
        flex: '0 0 25%'
    },

    itemHeader: {
        padding: '0 2rem'
    },

    flexItemCapitialize: {
        flex: '0 0 25%',
        textTransform: 'capitalize'
    }
};

const initCollapsibleElements = () => {
    const bgClasses = ['teal', 'lighten-5'];
    const onOpenStartCb = (el) => {
        el.querySelector('.collapsible-header').classList.add(...bgClasses);
    };
    const onCloseEndCb = (el) => {
        el.querySelector('.collapsible-header').classList.remove(...bgClasses);
    };
    const elems = document.querySelectorAll('.collapsible.expandable');
    M.Collapsible.init(elems, {
        accordion: false,
        onOpenStart: onOpenStartCb,
        onCloseEnd: onCloseEndCb
    });
};

const NoteDetails = ({ note }) => {
    const { first, last } = note.submittedBy.name;
    return (
        <p style={{ margin: '.125rem 0' }}>
            <span style={{ fontWeight: 'bold' }}>{`${first} ${last}: `}</span> {note.body}
        </p>
    );
};

const AddNoteForm = React.memo(({ itemId, onNoteAdd }) => {
    const { contextUser } = useAuthContext();
    const [note, setNote] = useState('');

    const { addNote } = useAddNoteToItem((response) => {
        if (response.success) {
            onNoteAdd(itemId, response.payload.item);
            setNote('');
            M.updateTextFields();
            M.toast({ html: 'Note added to request', classes: 'teal' });
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (note.length > 0) {
            const noteBody = {
                authorId: contextUser.id,
                body: note
            };

            addNote({ itemId, noteBody });
        }
    };

    const handleChange = (e) => {
        setNote(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Add a Note (avoid including PII)"
                type="text"
                name={`note${itemId}`}
                value={note}
                handleChange={handleChange}
            />
            <button className="btn waves-effect waves-light" type="submit" onClick={() => {}}>
                Add Note
            </button>
        </form>
    );
});

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

const List = ({ filter, items }) => {
    const [displayableItems, setDisplayableItems] = useState([]);
    const queryClient = useQueryClient();

    const { updateItem } = useUpdateItem((response) => {
        if (response.success) {
            queryClient.invalidateQueries('items');
        }
    });

    useEffect(() => {
        initCollapsibleElements();
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
        </ul>
    );
};

const ApproverInbox = () => {
    const { data, isLoading } = useItems();
    const items = (data && data.payload.items) || [];

    useEffect(() => {
        M.Tabs.init(document.querySelectorAll('.tabs'), {});
    }, [isLoading]);

    return (
        <div style={{ marginTop: '3rem' }}>
            {isLoading ? (
                <div style={{ margin: '6rem 0', display: 'flex', justifyContent: 'center' }}>
                    <Spinner />
                </div>
            ) : (
                <div className="row" style={{ marginTop: '40px' }}>
                    <div className="col s12">
                        <ul className="tabs">
                            <li className="tab col s3">
                                <a className="active" href="#active">
                                    Open
                                </a>
                            </li>
                            <li className="tab col s3">
                                <a href="#approved">In Process</a>
                            </li>
                            <li className="tab col s3">
                                <a href="#wishlist">Wishlist</a>
                            </li>
                            <li className="tab col s3">
                                {/* Fullfilled, rejected, or archived */}
                                <a href="#archive">Closed</a>
                            </li>
                        </ul>
                    </div>
                    <div id="active" className="col s12">
                        <List items={items} filter="active" />
                    </div>
                    <div id="approved" className="col s12">
                        <List items={items} filter="approved" />
                    </div>
                    <div id="wishlist" className="col s12">
                        <List items={items} filter="wishlist" />
                    </div>
                    <div id="archive" className="col s12">
                        <List items={items} filter="archived" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApproverInbox;
