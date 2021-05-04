import { useEffect } from 'react';
import Footer from '@components/Footer';
import NewsLetter from '@components/NewsLetter';

const GeneralTemplate = ({ children }) => {

    // Scroll to top of page on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    });

    return (
        <>
            {children}
            <NewsLetter />
            <Footer />
        </>
    )
};

export default GeneralTemplate;