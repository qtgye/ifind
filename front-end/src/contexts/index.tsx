import { GlobalContextProvider } from "./globalDataContext";
import { RegionContextProvider } from "./regionContext";
import { ProductContextProvider } from "./productContext";
import { CategoriesContextProvider } from "./categoriesContext";
import { GlobalStateContextProvider } from "./globalStateContext";
import { SourceRegionProvider } from "./sourceRegionContext";
import { LanguagesProvider } from "./languagesContext";
import { PropsWithChildren } from "react";

export const Providers = ({ children }: PropsWithChildren<React.ReactNode>) => {
  return (
    <LanguagesProvider>
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
    </LanguagesProvider>
  );
};
