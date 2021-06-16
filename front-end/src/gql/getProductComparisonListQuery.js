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
        }
        products {
            id
            title
            image
            url
            categories {
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