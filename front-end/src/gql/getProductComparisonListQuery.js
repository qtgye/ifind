import { gql } from "apollo-boost";

const getProductComparisonList = gql`
query ProductComparisonList {
    productComparisonList(language: "en") {
        category {
            id
            label {
                id
                label
            }
            order
        }
        products {
            id
            title
            amazon_url
            price
            image
            category {
                label {
                    label
                    language {
                        id
                        name
                    }
                }
            }
        }
    }
}
`;

export default getProductComparisonList;