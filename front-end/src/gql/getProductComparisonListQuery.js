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
            amazon_url
            price
            image
            url_list {
                source {
                    id
                    button_logo {
                        url
                    }
                }
                region {
                    id
                    currency {
                        symbol
                    }
                }
                url
                price
                is_base
            }
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