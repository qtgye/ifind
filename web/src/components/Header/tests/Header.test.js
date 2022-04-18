import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom';

import Header from '..';
import HeaderMiddle from '../HeaderMiddle';

describe('Header Component', () => {

    it('Renders default data without crashing', () => {
        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        const headerElement = document.querySelector('.header');

        expect(headerElement).not.toBe(null);
    });

});


describe('Header Search', () => {

    it('Accepts user input and submits form properly', () => {
        const searchTerm = 'Test Input';
        const mockSubmitHandler = jest.fn();

        render(
            <BrowserRouter>
                <HeaderMiddle onSubmit={mockSubmitHandler} />
            </BrowserRouter>
        );

        const headerForm = document.querySelector('form');
        const headerFormInput = headerForm.querySelector('input');

        headerFormInput.value = searchTerm;
        headerForm.submit();

        expect(headerForm).not.toBe(null);
        expect(mockSubmitHandler).toBeCalledWith({ search: searchTerm });
    });

});
