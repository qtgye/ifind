import { gql } from "apollo-boost";

const globalDataQuery = gql`
query GlobalDataQuery ($language: String) {
    footerSettingsByLanguage (language: $language) {
        footer_links {
            label
            page {
                slug
            }
        }
        footer_text
        footer_footnote
    }
}
`;

export default globalDataQuery;