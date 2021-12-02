import React from "react";
import { useTags } from '../../providers/tagsProvider';
import withConditionalRender from "../../helpers/withConditionalRender";

interface TagSelectProps {
  tags?: string[];
}

const TagSelect = () => {
  const { tags } = useTags();

  console.log({ tagsFromProvider: tags });

  return <>
    Tags
  </>;
};

export default withConditionalRender(TagSelect as React.FunctionComponent);
