import { gql } from "apollo-boost";

const getLanguagesQuery = gql`
query Languages {
  languages {
    code
    name
  }
}
`

export default getLanguagesQuery;
