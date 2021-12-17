import { gql } from "apollo-boost";

const productsByDealsQuery = gql`
  query ProductsByDealsQuery {
    productsByDeals {
      deal_type {
        name
        source {
          name
        }
        label {
          language
          label
        }
      }
      products {
        id
        amazon_url
        price
        price_original
        discount_percent
        quantity_available_percent
        title
        deal_type
        image
        url_list {
          source {
            id
            name
          }
          region {
            id
          }
          price
          url
          price_original
          discount_percent
          quantity_available_percent
        }
      }
    }
  }
`;

export default productsByDealsQuery;
