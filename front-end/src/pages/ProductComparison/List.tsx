import React, { LegacyRef, useContext, useEffect, useRef } from 'react';
import { GlobalStateContext } from '@contexts/globalStateContext';

const List = ({ index, observeItem }: ListProps) => {
    const { focusedIndex } = useContext(GlobalStateContext);
    const itemRef = useRef<HTMLDivElement>();

    useEffect(() => {
      if ( itemRef.current && observeItem ) {
        const unObserve = observeItem(itemRef.current);
        return unObserve;
      }
    }, [observeItem]);

    useEffect(() => {
        if (focusedIndex === index && itemRef.current) {
            const currentScroll = window.pageYOffset;
            const { top } = itemRef.current.getBoundingClientRect();
            const targetScroll = currentScroll + top;

            window.scrollTo(0, targetScroll);
        }
    }, [focusedIndex, index]);

    return (
        <div ref={itemRef as LegacyRef<HTMLDivElement>} data-index={index} className="prodcomp-area-list">
            List {index}
        </div>
    );
};

export default List;
