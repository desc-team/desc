export const closedStatuses = ['denied', 'fulfilled', 'archived'];

export const inboxStyles = {
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

export function initCollapsibleElements(materializeLib) {
    const bgClasses = ['teal', 'lighten-5'];

    const onOpenStartCb = (el) => {
        el.querySelector('.collapsible-header').classList.add(...bgClasses);
    };

    const onCloseEndCb = (el) => {
        el.querySelector('.collapsible-header').classList.remove(...bgClasses);
    };

    const elems = document.querySelectorAll('.collapsible.expandable');

    materializeLib.Collapsible.init(elems, {
        accordion: false,
        onOpenStart: onOpenStartCb,
        onCloseEnd: onCloseEndCb
    });
}

export function updateItemsWithNote(itemId, itemData) {
    return (item) => {
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
    };
}
