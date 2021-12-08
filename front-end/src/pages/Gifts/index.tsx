import { useCallback } from "react";
import { useHistory, useLocation } from 'react-router-dom';
import GeneralTemplate from "@templates/GeneralTemplate";
import { withComponentName } from "@utilities/component";
import { addURLParams, useSearchParams } from "@utilities/url";
import { useGiftIdeas, GiftIdeasProvider } from "@contexts/giftIdeasContext";
import { TagsProvider } from "@contexts/tagsContext";

import TagsFilter from "@components/TagsFilter";
import ProductDealCard from "@components/ProductDealCard";
import Pagination from "@components/Pagination";

import "./styles.scss";

const Gifts = () => {
  const { tags: selectedTags = [] } = useSearchParams();
  const { pathname, search } = useLocation();
  const history = useHistory();
  const { products, total = 0 }: GiftIdeasContextData = useGiftIdeas();

  const onTagsUpdate = useCallback((tags: (string|number)[]) => {
    history.push(addURLParams(pathname + search, { tags, page: 1 }));
  }, [ history, pathname, search ]);

  return (
    <GeneralTemplate>
      <div className="gifts container">
        <div className="gifts__columns">
          <TagsFilter selectedTags={selectedTags} onUpdate={onTagsUpdate} />
          <div className="gifts__products">
            <div className="gifts__products-grid">
              {products?.map((product) => (
                <ProductDealCard key={product.id} {...product} />
              ))}
            </div>
            <div className="gifts__products-pagination">
            <Pagination totalPages={Math.ceil(total / 20)} />
            </div>
          </div>
        </div>
      </div>
    </GeneralTemplate>
  );
};

const WrappedGiftsPage = () => (
  <TagsProvider>
    <GiftIdeasProvider>
      <Gifts />
    </GiftIdeasProvider>
  </TagsProvider>
);

export default withComponentName("GiftsPage")(WrappedGiftsPage);
