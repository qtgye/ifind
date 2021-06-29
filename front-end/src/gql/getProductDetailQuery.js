import { gql } from "apollo-boost";

const getProductDetailQuery = gql`
query GetProductDetailQuery ($id: ID!, $language:String) {
    productDetails ( id: $id, language: $language ) {
        id
        details_html
        price
        image
    }
}
`;

export default getProductDetailQuery;