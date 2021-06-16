import { gql } from "apollo-boost";

const generateChildCategory = (iterationsLeft) => {
    return `
        id
        icon
        label {
            label
        }
        region {
            code
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
        ${generateChildCategory(3)}
    }
}
`;

export default getCategoryTree;