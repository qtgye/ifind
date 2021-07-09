import { GlobalContextProvider } from './globalDataContext';
import { RegionContextProvider } from '@contexts/regionContext';
import { ProductContextProvider } from './productContext';
import { CategoriesContextProvider } from '@contexts/categoriesContext';
import { SourceRegionProvider } from '@contexts/sourceRegionContext';
import { useAuth } from '@contexts/authContext';

export const Providers = ({ children }) => {
    const { token } = useAuth();

    return token && (
        <GlobalContextProvider>
            <SourceRegionProvider>
                <RegionContextProvider>
                    <CategoriesContextProvider>
                        <ProductContextProvider>
                            {children}
                        </ProductContextProvider>
                    </CategoriesContextProvider>
                </RegionContextProvider>
            </SourceRegionProvider>
        </GlobalContextProvider>
    )
};
