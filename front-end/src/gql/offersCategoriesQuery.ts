import { gql } from "apollo-boost";

const offersCategoriesQuery = gql`
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
`;

export default offersCategoriesQuery;
