import { GlobalContextProvider } from './globalDataContext';
import { RegionContextProvider } from '@contexts/regionContext';
import { ProductContextProvider } from './productContext';
import { CategoriesContextProvider } from '@contexts/categoriesContext';
import { GlobalStateContextProvider } from '@contexts/globalStateContext';
import { useAuth } from '@contexts/authContext';

const providers = [
    GlobalContextProvider,
    GlobalStateContextProvider,
    ProductContextProvider,
    RegionContextProvider,
    CategoriesContextProvider,
    ProductContextProvider,
].reverse();

export const Providers = ({ children }) => {
    const { token } = useAuth();

    return token && (

        providers.reduce((all, ParentProvider) => (

            <ParentProvider>
                {all}
            </ParentProvider>
        ), children)
    )
};
