import { GlobalContextProvider } from './globalDataContext';
import { RegionContextProvider } from '@contexts/regionContext';
import { ProductContextProvider } from './productContext';
import { CategoriesContextProvider } from '@contexts/categoriesContext';
import { useAuth } from '@contexts/authContext';

const providers = [
    GlobalContextProvider,
    RegionContextProvider,
    CategoriesContextProvider,
    ProductContextProvider,
].reverse();

export const Providers = ({ children }) => {
    const { token } = useAuth();

    return token && (
        providers.reduce(( all, ParentProvider ) => (
            <ParentProvider>
                {all}
            </ParentProvider>
        ), children)
    )
};
