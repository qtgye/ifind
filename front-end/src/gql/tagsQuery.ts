import { gql } from "apollo-boost";

const tagsQuery = gql`
  query TagsQuery {
    tags {
      id
      slug
      label {
        label
        language {
          code
        }
      }
      products {
        id
      }
    }
  }
`;

export default tagsQuery;
