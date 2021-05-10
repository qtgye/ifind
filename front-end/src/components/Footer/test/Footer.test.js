import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom';

import Footer from '../';

describe('Footer Component', () => {

    it('Renders default data without crashing', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );

        const footerElement = document.getElementsByClassName('.footer');
        expect(footerElement).not.toBe(null);

    });

});