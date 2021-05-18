import { GlobalContextProvider } from './globalDataContext';
import { HomepageContextProvider } from './homepageContext';
import { ProductContextProvider } from './productContext';
import { useAuth } from '@contexts/authContext';

const providers = [
    GlobalContextProvider,
    HomepageContextProvider,
    ProductContextProvider,
];

export const Providers = ({ children }) => {
    const { token } = useAuth();

    return token && (
        providers.reverse().reduce(( all, ParentProvider ) => (
            <ParentProvider>
                {all}
            </ParentProvider>
        ), children)
    )
};
