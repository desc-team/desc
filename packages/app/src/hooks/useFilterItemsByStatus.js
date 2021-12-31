import { useEffect, useState } from 'react';

function useFilterItemsByStatus(items, filter) {
    const [list, setList] = useState([]);
    useEffect(() => {
        const filteredList = items.filter((item) => {
            if (Array.isArray(filter)) {
                return filter.some((status) => status === item.status);
            }
            return item.status === filter;
        });
        setList(filteredList);
    }, [items, filter]);

    return [list, setList];
}

export default useFilterItemsByStatus;
