import { gql } from "apollo-boost";

const getCategoryTree = gql`
query GetCategoryTree($language: String!) {
    categoryTree (language: $language) {
        categories {
            id
            label
            icon
            children {
                id
                label
                icon
            }
        }
    }
}
`;

export default getCategoryTree;