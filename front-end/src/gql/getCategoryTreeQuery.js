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
query GetCategoryTree($region: String!, $language: String) {
    categoryTree (region: $region, language: $language) {
        ${generateChildCategory(3)}
    }
}
`;

export default getCategoryTree;