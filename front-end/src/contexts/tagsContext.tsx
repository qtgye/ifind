import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import { useQuery } from "@apollo/client";
import tagsQuery from "@gql/tagsQuery";

export const TagsContext = createContext<TagsContextData>({});

export const TagsProvider = ({
  children,
}: React.PropsWithChildren<any>) => {
  const { data } = useQuery(tagsQuery);
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (data?.tags) {
      setTags(data.tags);
    }
  }, [data]);

  return (
    <TagsContext.Provider value={{ tags }}>
      {children}
    </TagsContext.Provider>
  );
};

export const useTags = () => useContext(TagsContext);
