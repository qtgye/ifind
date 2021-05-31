import { GlobalContextProvider } from './globalDataContext';
import { ProductContextProvider } from './productContext';
import { CategoriesContextProvider } from '@contexts/categoriesContext';
import { useAuth } from '@contexts/authContext';

const providers = [
    GlobalContextProvider,
    ProductContextProvider,
    CategoriesContextProvider,
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
