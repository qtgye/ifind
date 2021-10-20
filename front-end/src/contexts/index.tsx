import { GlobalContextProvider } from "./globalDataContext";
import { RegionContextProvider } from "@contexts/regionContext";
import { ProductContextProvider } from "./productContext";
import { CategoriesContextProvider } from "@contexts/categoriesContext";
import { GlobalStateContextProvider } from "@contexts/globalStateContext";
import { SourceRegionProvider } from "@contexts/sourceRegionContext";
import { PropsWithChildren } from "react";

export const Providers = ({ children }: PropsWithChildren<React.ReactNode>) => {
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
