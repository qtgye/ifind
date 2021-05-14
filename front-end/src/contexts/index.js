import { GlobalContextProvider } from './global';
import { HomepageContextProvider } from './homepageContext';
import { ProductContextProvider } from './productContext';

const providers = [
    GlobalContextProvider,
    HomepageContextProvider,
    ProductContextProvider,
];

export const Providers = ({ children }) => (
    providers.reverse().reduce(( all, ParentProvider ) => (
        <ParentProvider>
            {all}
        </ParentProvider>
    ), children)
);
