import { useEffect } from 'react';

const GeneralTemplate = ({ children }) => {

    // Scroll to top of page on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            {children}
        </>
    )
};

export default GeneralTemplate;
