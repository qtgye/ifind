import { useEffect } from 'react';
import Footer from '@components/Footer';
import NewsLetter from '@components/NewsLetter';
import Carousel from '../../components/Carousel';

const GeneralTemplate = ({ children }) => {

    // Scroll to top of page on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            {children}
            <Carousel />
            <NewsLetter />
            <Footer />
        </>
    )
};

export default GeneralTemplate;