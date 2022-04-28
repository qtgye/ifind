import { useEffect, useState } from "react";
import Head from "next/head";

// import { PageContextProvider } from "contexts/pageContext";
import BasicPageTemplate from "templates/BasicPage";
import { getPages, getPage } from "providers/pageContext";
import { getLanguages } from "providers/globalDataContext";
import type { GetStaticPropsContext } from "next";

const BasicPage = (pageData: ComponentEntryFieldsPageFields) => {
  return (
    <BasicPageTemplate title={pageData?.title || ""}>
      <Head>
        <title>{pageData?.title || ""}</title>
      </Head>
      <div
        dangerouslySetInnerHTML={{
          __html: pageData?.body || "",
        }}
      ></div>
    </BasicPageTemplate>
  );
};

export const getStaticPaths = async () => {
  const [{ languages = [] }, { pages = [] }] = await Promise.all([
    getLanguages(),
    getPages(),
  ]);

  const pagePaths: { params: PageParams }[] = [];

  pages.forEach(({ slug }) => {
    languages.forEach(({ code: language }) => {
      pagePaths.push({
        params: {
          language,
          page: slug as string,
        },
      });
    });
  });

  return {
    paths: pagePaths,
    fallback: "blocking", // false or 'blocking'
  };
};

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<PageParams>) => {
  const { language, page: slug } = params || {};
  const { pageBySlug } = await getPage({ language, slug });

  return {
    props: pageBySlug?.data || {},
  };
};

export default BasicPage;
