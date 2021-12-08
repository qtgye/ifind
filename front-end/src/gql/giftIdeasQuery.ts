import { gql } from "apollo-boost";

const giftIdeasQuery = gql`
  query GiftIdeasQuery($page: Int, $tags: [ID]) {
    giftIdeas(page: $page, tags: $tags) {
      products {
        id
        title
        image
        deal_type
        amazon_url
        url_list {
          price
          price_original
          discount_percent
          quantity_available_percent
          source {
            id
            name
          }
          region {
            id
          }
        }
        price
        price_original
        discount_percent
        quantity_available_percent
        tags {
          id
          label {
            label
            language {
              code
            }
          }
        }
      }
      total
    }
  }
`;

export default giftIdeasQuery;
