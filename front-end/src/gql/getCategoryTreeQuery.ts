import { gql } from "apollo-boost";

const generateParentCategoryFragment = (iterationsLeft: number): string => (iterationsLeft && `
    parent {
        id
        label {
            label
        }
        ${generateParentCategoryFragment(--iterationsLeft)}
    }
`) || '';

const generateChildCategory = (iterationsLeft: number): string => {
    return `
        id
        icon
        order
        label {
            label
        }
        ${generateParentCategoryFragment(10)}
        ${(iterationsLeft &&
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
    languages (where: {code: $language}) {
      code
    }
}
`;

export default getCategoryTree;
