import { GlobalContextProvider } from "./globalDataContext";
import { RegionContextProvider } from "@contexts/regionContext";
import { ProductContextProvider } from "./productContext";
import { CategoriesContextProvider } from "@contexts/categoriesContext";
import { GlobalStateContextProvider } from "@contexts/globalStateContext";
import { SourceRegionProvider } from "@contexts/sourceRegionContext";

export const Providers = ({ children }) => {
  return (
    <GlobalContextProvider>
      <GlobalStateContextProvider>
        <SourceRegionProvider>
          <RegionContextProvider>
            <CategoriesContextProvider>
              <ProductContextProvider>{children}</ProductContextProvider>
            </CategoriesContextProvider>
          </RegionContextProvider>
        </SourceRegionProvider>
      </GlobalStateContextProvider>
    </GlobalContextProvider>
  );
};
