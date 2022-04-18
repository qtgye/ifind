import { NextPageContext } from "next";
import Head from "next/head";
import {
  getOffersCategories,
  OffersCategoriesProvider,
} from "providers/offersCategoriesContext";
import {
  getProductsByDeals,
  ProductsByDealsContextProvider,
} from "providers/productsByDealsContext";
import GeneralTemplate from "templates/GeneralTemplate";

function Offer() {
  return <>
    <Head>
      <title>Offers Page</title>
    </Head>
    <GeneralTemplate>
      Offer Page
    </GeneralTemplate>
  </>;
}

export default function OfferWrapped({
  offersCategories,
  productsByDeals,
  ...pageProps
}: OfferWrappedProps) {
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
