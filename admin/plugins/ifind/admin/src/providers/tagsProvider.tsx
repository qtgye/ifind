import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useGQLFetch } from "../helpers/gqlFetch";

interface TagsContextData {
  tags?: Tag[];
}

interface TagsProviderProps {
  children: React.ReactNode;
}

const tagsQuery = `
  query Tags {
    tags {
      id
      slug
      label {
        label
        language {
          code
        }
      }
    }
  }
`

export const TagsContext = createContext<TagsContextData>({});

export const TagsProvider = ({ children }: TagsProviderProps) => {
  const gqlFetch = useGQLFetch();
  const [tags, setTags] = useState<Tag[]>([]);

  const fetchTags = useCallback(() => {
    gqlFetch(tagsQuery)
    .then(({ tags }) => tags && setTags(tags));
  }, [ gqlFetch ])

  useEffect(() => {
    fetchTags();
  }, [ fetchTags ]);

  return (
    <TagsContext.Provider value={{ tags }}>{children}</TagsContext.Provider>
  );
};

export const useTags = () => useContext(TagsContext);
