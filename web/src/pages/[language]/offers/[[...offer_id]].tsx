import { GetStaticPropsContext, NextPageContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { useGlobalState } from "providers/globalStateContext";
import { getLanguages } from "providers/globalDataContext";
import {
  getOffersCategories,
  OffersCategoriesProvider,
} from "providers/offersCategoriesContext";
import RenderIf from "components/RenderIf";
import ProductDealsGrid from "components/ProductDealsGrid";
import ProgressBars from "components/ProgressBar";
import { OffersSideNavProvider } from "components/OffersSideNav/context";
import {
  getProductsByDeals,
  ProductsByDealsContextProvider,
  useProductsByDeals,
} from "providers/productsByDealsContext";
import { useEffect } from "react";
import GeneralTemplate from "templates/GeneralTemplate";

type OfferPageParams = {
  offer_id: string;
};

function Offer() {
  const { loading = false, productsByDeals } = useProductsByDeals();
  const icon = "/images/loading.png";

  return (
    <GeneralTemplate>
      <Head>
        <title>Offers Page</title>
      </Head>
      <div className="offers">
        <div className="offers__container">
          <RenderIf condition={loading}>
            <span className="loading">
              <img src={icon} className="loading-icon" alt="icon" />
            </span>
            <div className="progress">
              <ProgressBars />
            </div>
          </RenderIf>
          {!loading &&
            (productsByDeals || []).map((productsByDeal) => (
              <ProductDealsGrid
                key={productsByDeal.deal_type.name}
                {...productsByDeal}
              />
            ))}
        </div>
      </div>
    </GeneralTemplate>
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
    <ProductsByDealsContextProvider productsByDeals={productsByDeals}>
      <OffersCategoriesProvider offersCategories={offersCategories}>
        <OffersSideNavProvider>
          <Offer {...pageProps} />
        </OffersSideNavProvider>
      </OffersCategoriesProvider>
    </ProductsByDealsContextProvider>
  );
}

export const getStaticPaths = async () => {
  const [{ languages }, { offersCategories }] = await Promise.all([
    getLanguages(),
    getOffersCategories(),
  ]);

  // Build [language]/offers/[offer_id] paths
  const offerPaths: {
    params: {
      language: string;
      offer_id: string[] | null;
    };
  }[] = [];

  languages.forEach(({ code: language }) => {
    // Add offers root
    offerPaths.push({
      params: {
        language,
        offer_id: null,
      },
    });

    offersCategories.forEach(({ id: offer_id }) => {
      // Add offers per id
      offerPaths.push({
        params: {
          language,
          offer_id: [offer_id],
        },
      });
    });
  });

  return {
    paths: offerPaths,
    fallback: "blocking", // false or 'blocking'
  };
};

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<OfferPageParams>) => {
  const { offer_id } = params || {};

  try {
    const [{ offersCategories }, { productsByDeals }] = await Promise.all([
      getOffersCategories(),
      getProductsByDeals(offer_id ? offer_id[0] : ""),
    ]);

    return {
      props: {
        offersCategories,
        productsByDeals,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {},
    };
  }
};
