import React, { useEffect, useState } from 'react';
import M from 'materialize-css';
import Spinner from '../Common/Spinner';
import TextField from '../Common/TextField';
import { useAuthContext } from '../../context/AuthContext';
import useItemsByUserId from '../../hooks/useItemsByUserId';
import useAddNoteToItem from '../../hooks/useAddNoteToItem';

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
    const { token, contextUser } = useAuthContext();
    const [note, setNote] = useState('');

    const { mutate: addNote } = useAddNoteToItem((response) => {
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

            addNote({ itemId, noteBody, token });
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
                <p style={css.flexItem}>Item</p>
                <p style={css.flexItem}>Quantity</p>
                <p style={css.flexItem}>Client ID</p>
                <p style={css.flexItem}>Request Date</p>
            </div>
        </li>
    );
};

const List = ({ items, filter }) => {
    const [displayableItems, setDisplayableItems] = useState([]);

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

    return (
        <ul className="collapsible expandable">
            <ListHeader />
            {displayableItems &&
                displayableItems.map((item) => {
                    return (
                        <li key={item.id}>
                            <div className="collapsible-header" style={css.itemHeader}>
                                <p style={css.flexItemCapitialize}>{item.name}</p>
                                <p style={css.flexItem}>{item.quantity}</p>
                                <p style={css.flexItem}>{item.clientId}</p>
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

const RequestorInbox = () => {
    const authContext = useAuthContext();

    const { data, error, isLoading } = useItemsByUserId(authContext.contextUser.id);
    const items = (data && data.payload.items) || [];

    useEffect(() => {
        M.Tabs.init(document.querySelectorAll('.tabs'), {});
        initCollapsibleElements();
    }, [isLoading]);

    return (
        <div style={{ marginTop: '3rem' }}>
            {error && (
                <div className="center-align red-text text-lighten-1">
                    <h6>{error}</h6>
                </div>
            )}
            {isLoading ? (
                <div style={{ margin: '6rem 0', display: 'flex', justifyContent: 'center' }}>
                    <Spinner />
                </div>
            ) : (
                <div className="row" style={{ marginTop: '40px' }}>
                    <div className="col s12">
                        <ul className="tabs">
                            <li className="tab col s3">
                                <a className="active" href="#open">
                                    Open
                                </a>
                            </li>
                            <li className="tab col s3">
                                <a href="#approved">Approved</a>
                            </li>
                            <li className="tab col s3">
                                <a href="#declined">Declined</a>
                            </li>
                            <li className="tab col s3">
                                <a href="#wishlist">Wishlist</a>
                            </li>
                            <li className="tab col s3">
                                <a href="#fulfilled">Fulfilled</a>
                            </li>
                        </ul>
                    </div>
                    <div id="open" className="col s12">
                        <List type="open" items={items} filter="active" />
                    </div>
                    <div id="approved" className="col s12">
                        <List type="approved" items={items} filter="approved" />
                    </div>
                    <div id="declined" className="col s12">
                        <List type="declined" items={items} filter="denied" />
                    </div>
                    <div id="wishlist" className="col s12">
                        <List type="wishlist" items={items} filter="wishlist" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RequestorInbox;
