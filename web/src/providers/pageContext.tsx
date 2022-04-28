import gqlFetch from "utilities/gqlFetch";

export const pageBySlugQuery = `
query PageBySlugQuery ($slug: String!, $language: String) {
  pageBySlug (slug:$slug, language:$language) {
      slug
      data {
          title
          body
      }
  }
}`;

export const pagesQuery = `
query {
  pages {
    slug
  }
}
`;

export const getPages = async () => gqlFetch<PagesPayload>(pagesQuery);

export const getPage = async ({ language, slug }: GetPageVariables) => {
  return gqlFetch<PagePayload>(pageBySlugQuery, {
    language,
    slug,
  });
};
