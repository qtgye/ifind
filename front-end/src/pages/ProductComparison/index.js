import GeneralTemplate from '@templates/GeneralTemplate';
import { withComponentName, withProvider } from '@utilities/component';
import { useProductComparison } from '@contexts/productComparisonContext';
import { useContext, useCallback, useRef } from 'react';
import { GlobalStateContext } from '@contexts/globalStateContext';
import NaturalList from '@components/NaturalList';

const ProductComparison = () => {
  const { productComparisonList, loading } = useProductComparison();
  const icon = '/images/loading.png';
  const prodcompRef = useRef();

  const { setActiveCategory } = useContext(GlobalStateContext);
  let options = {
    root: document.querySelector('natural-list__content'),
    rootMargin: '0px',
    threshold: 0.02,
  }

  const onIntersect = useCallback(([intersection]) => {
    const { target, isIntersecting } = intersection;

    if (isIntersecting) {
      const category = target.dataset.category;
      setActiveCategory(category);
      console.log(category);
    }
  }, [setActiveCategory]);

  // const observerRef = useRef(new IntersectionObserver(onIntersect, options));
  const observerRef = useRef(new IntersectionObserver(onIntersect, options));

  const observeItem = useCallback((e) => {
    observerRef.current.observe(e);
    return () => {
      observerRef.current.unobserve(e);
    }
  }, [observerRef]);


  return (
    <GeneralTemplate>
      <div ref={prodcompRef}
        className="product-comparison"
      >
        <div className="container" style={{ paddingLeft: '280px' }}>
          {loading && <span className="loading"><img src={icon} className="loading-icon" alt="icon" /></span>}
          <div className="product-comparison__list">
            {!loading &&
              productComparisonList.map(({ category, products }) => (
                <NaturalList
                  key={category.id}
                  items={products}
                  observeItem={observeItem}
                  id={category.id}
                  label={category.label.label}
                  category={category}
                />
              ))
            }
          </div>
        </div>
      </div>
    </GeneralTemplate>
  )
};

export default (
  withProvider('ProductComparisonContextProvider')(withComponentName('ProductComparisonPage')(ProductComparison))
);