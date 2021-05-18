import { gql } from "apollo-boost";

const globalDataQuery = gql`
query GlobalDataQuery ($locale: String!) {
    footerSetting (locale: $locale) {
        links {
            label
            url
        }
        footer_text
        footer_footnote
    }
    contactDetail {
        email
        phone_number
    }
    socialNetwork {
        social_network {
            type
            url
        }
    }
}
`;

export default globalDataQuery;