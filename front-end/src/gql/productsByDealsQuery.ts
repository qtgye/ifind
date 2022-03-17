import { gql } from "apollo-boost";

const productsByDealsQuery = gql`
  query ProductsByDealsQuery($offer_id: String) {
    productsByDeals(offer_category: $offer_id) {
      deal_type {
        name
        source {
          name
        }
        label {
          language
          label
        }
        last_run
        nav_label {
          label
          language
        }
        nav_icon {
          type
          icon
        }
      }
      total_products
      products {
        id
        amazon_url
        price
        price_original
        discount_percent
        quantity_available_percent
        title
        deal_type
        deal_merchant
        deal_quantity_available_percent
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
