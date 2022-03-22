import { gql } from "apollo-boost";

const offersCategoriesQuery = gql`
  query OffersCategoriesQuery {
    offersCategories {
      id
      label {
        label
        language
      }
      dealTypes
    }
  }
`;

export default offersCategoriesQuery;
