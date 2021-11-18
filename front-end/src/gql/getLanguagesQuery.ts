import { gql } from "apollo-boost";

const getLanguagesQuery = gql`
query Languages {
  languages {
    code
    name
    country_flag
  }
}
`

export default getLanguagesQuery;
