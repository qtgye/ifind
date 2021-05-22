import { gql } from "apollo-boost";

const getProductDetail = gql`
    query GetProductDetailQuery($productDetailURL: String!) {
        productDetail ( productDetailURL: $productDetailURL ) {
            detailURL
            detailsHTML
        }
    }
`;

export default getProductDetail;