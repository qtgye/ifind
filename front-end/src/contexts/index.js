import { GlobalContextProvider } from './globalDataContext';
import { ProductContextProvider } from './productContext';
import { CategoriesContextProvider } from '@contexts/categoriesContext';
import { GlobalStateContextProvider } from '@contexts/globalStateContext';
import { useAuth } from '@contexts/authContext';

const providers = [
    GlobalContextProvider,
    GlobalStateContextProvider,
    ProductContextProvider,
    CategoriesContextProvider,
];

export const Providers = ({ children }) => {
    const { token } = useAuth();

    return token && (
        providers.reverse().reduce((all, ParentProvider) => (
            <ParentProvider>
                {all}
            </ParentProvider>
        ), children)
    )
};
