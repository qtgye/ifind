import { NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useGlobalState } from "providers/globalStateContext";
import {
  getOffersCategories,
  OffersCategoriesProvider,
} from "providers/offersCategoriesContext";
import {
  getProductsByDeals,
  ProductsByDealsContextProvider,
} from "providers/productsByDealsContext";
import { useEffect } from "react";
import GeneralTemplate from "templates/GeneralTemplate";

function Offer() {
  return (
    <>
      <Head>
        <title>Offers Page</title>
      </Head>
      <GeneralTemplate>Offer Page</GeneralTemplate>
    </>
  );
}

export default function OfferWrapped({
  offersCategories,
  productsByDeals,
  ...pageProps
}: OfferWrappedProps) {
  const {
    query: { offer_id },
  } = useRouter();
  const { setActiveOffer } = useGlobalState();

  useEffect(() => {
    if (!offer_id && offersCategories?.length && setActiveOffer) {
      const [{ id }] = offersCategories;
      setActiveOffer(id);
    }
  }, [offer_id, offersCategories, setActiveOffer]);

  return (
    <OffersCategoriesProvider offersCategories={offersCategories}>
      <ProductsByDealsContextProvider productsByDeals={productsByDeals}>
        <Offer {...pageProps} />
      </ProductsByDealsContextProvider>
    </OffersCategoriesProvider>
  );
}

OfferWrapped.getInitialProps = async ({ query }: NextPageContext) => {
  const { offer_id } = query;

  const [{ offersCategories }, { productsByDeals }] = await Promise.all([
    getOffersCategories(),
    getProductsByDeals((offer_id || "") as string),
  ]);

  return { offersCategories, productsByDeals };
};
