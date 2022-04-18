/**
 * Use this in case dynamic pages are implemented
 */
import { NextPageContext } from "next";
import { useRouter } from "next/router";

import BasicPage from "templates/BasicPage";
import { getPage } from "providers/pageContext";

import OfferPage from "./[offer_id]";

export default function DynamicPage(props: any) {
  const {
    query: { page },
  } = useRouter();

  return page === "offers" ? (
    <OfferPage {...props} />
  ) : (
    <BasicPage {...props} />
  );
}

DynamicPage.getInitialProps = async ({ query }: NextPageContext) => {
  const { page, language } = query;

  const { pageBySlug } = await getPage({
    slug: page as string,
    language: language as string,
  });

  return { page: pageBySlug };
};
