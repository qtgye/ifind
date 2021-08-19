import { gql } from "apollo-boost";

const getProductComparisonList = gql`
query ProductComparisonList {
    productComparisonList(language: "en") {
        category {
            id
            label
            order
        }
        products {
            id
            title
            amazon_url
            price
            image
            created_at
        }
    }
}
`;

export default getProductComparisonList;