import { useEffect, useState } from 'react';
import GeneralTemplate from '@templates/GeneralTemplate';
import { withComponentName } from '@utilities/component';
import { ProductComparisonContextProvider, useProductComparison } from '@contexts/productComparisonContext';
import { useContext, useCallback, useRef } from 'react';
import { GlobalStateContext } from '@contexts/globalStateContext';
import NaturalList from '@components/NaturalList';

// TEST BLOCK
import { useCategoryTree } from '@contexts/categoriesContext';
// END TEST BLOCK

const ProductComparison = withComponentName('ProductComparisonPage')(() => {
  const { productComparisonList, setCurrentListCategory, loading } = useProductComparison();
  const icon = '/images/loading.png';
  const prodcompRef = useRef();

  // ---- TEST BLOCK
  const categoryTree = useCategoryTree();
  const [ currentCategory, setCurrentCategory ] = useState();

  useEffect(() => {
    setCurrentListCategory(currentCategory);
  }, [ currentCategory, setCurrentListCategory ]);

  useEffect(() => {
    if ( categoryTree[0] ) {
      setCurrentCategory(categoryTree[0].id)
    }
  }, [ categoryTree ]);
  // --- END TEST BLOCK

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

            {/* ---- TEST BLOCK */}
            <ul style={{ display: 'flex', columnGap: 10, padding: 10 }} hidden>
                {
                  categoryTree.map(category => (
                    <li key={category.id}>
                      <button
                        style={{
                          padding: '10px 15px',
                          backgroundColor: category.id === currentCategory ? 'green' : 'white',
                          color: category.id === currentCategory ? 'white' : 'gray',
                        }}
                        onClick={e => {
                          e.preventDefault();
                          setCurrentCategory(category.id)
                        }}
                      >
                          {category.label.label}
                      </button>
                    </li>
                  ))
                }
              </ul>
              {/* ---- END TEST BLOCK */}


            {!loading &&
              productComparisonList.map(({ category, products }) => (
                <NaturalList
                  key={category.id}
                  items={products}
                  observeItem={observeItem}
                  id={category.id}
                  label={category.label}
                  category={category}
                  date={category.created_at}
                />
              ))
            }
          </div>
        </div>
      </div>
    </GeneralTemplate>
  )
});

// TODO: Remove ProductComparisonContextProvider altogether once integrated in FE
export default withComponentName('ProductComparisonPage')((props) => (
  <ProductComparisonContextProvider>
    <ProductComparison {...props} />
  </ProductComparisonContextProvider>
));
