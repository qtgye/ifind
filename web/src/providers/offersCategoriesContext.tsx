import { useRouter } from "next/router";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import gqlFetch from "utilities/gqlFetch";

export const OffersCategoriesContext = createContext<OffersCategoriesContext>(
  {}
);

export const OffersCategoriesProvider = ({
  children,
  offersCategories = [],
}: OffersCategoriesProviderProps) => {
  const {
    query: { offer_id },
  } = useRouter();
  const activeOffer: OffersCategory | undefined =
    offersCategories.find(({ id }) => (offer_id?.length ? offer_id[0] === id : false )) ||
    offersCategories.find(({ isDefault }) => isDefault);

  const offersCategoryTranslationArrayToMap = useCallback(
    (translationArray: (OffersCategoryLabelTranslation | null)[]) =>
      translationArray.reduce(
        (translationMap: TranslationMap, translationLabel) => {
          if (translationLabel?.language) {
            translationMap[translationLabel.language] =
              translationLabel.label as string;
          }
          return translationMap;
        },
        {}
      ),
    []
  );

  return (
    <OffersCategoriesContext.Provider
      value={{
        offersCategories,
        activeOffer,
        offersCategoryTranslationArrayToMap,
      }}
    >
      {children}
    </OffersCategoriesContext.Provider>
  );
};

export const useOffersCategories = () => useContext(OffersCategoriesContext);

export const getOffersCategories = async () =>
  gqlFetch<OfferCategoriesPayload>(`
    query OffersCategoriesQuery {
      offersCategories {
        id
        label {
          label
          language
        }
        isDefault
        dealTypes
      }
    }
`);
