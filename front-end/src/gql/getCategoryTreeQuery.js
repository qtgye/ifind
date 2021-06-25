import { gql } from "apollo-boost";

const generateChildCategory = (iterationsLeft) => {
    return `
        id
        icon
        order
        label {
            label
        }
        ${
            (iterationsLeft &&
            `
                children {
                    ${generateChildCategory(--iterationsLeft)}
                }
            `) || ''
        }
    `
}

const getCategoryTree = gql`
query GetCategoryTree($language: String) {
    categoryTree (language: $language) {
        ${generateChildCategory(5)}
    }
}
`;

export default getCategoryTree;