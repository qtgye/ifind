import { useEffect, useState } from 'react';
import GeneralTemplate from '@templates/GeneralTemplate';
import { withComponentName } from '@utilities/component';
import { ProductComparisonContextProvider, useProductComparison } from '@contexts/productComparisonContext';
import { useContext, useCallback, useRef } from 'react';
import { GlobalStateContext } from '@contexts/globalStateContext';
import NaturalList from '@components/NaturalList';
import IfindIcon from '@components/IfindIcon';

import './buttonStyles.scss';
// TEST BLOCK
import { useCategoryTree } from '@contexts/categoriesContext';
import { useSubCategories } from '../../contexts/categoriesContext';
import Carousel from '../../components/Carousel';
// END TEST BLOCK

const ProductComparison = withComponentName('ProductComparisonPage')(() => {
  const { productComparisonList, setCurrentListCategory, loading } = useProductComparison();
  const icon = '/images/loading.png';
  const prodcompRef = useRef();
  const { setSubCategories } = useSubCategories();

  // ---- TEST BLOCK
  const categoryTree = useCategoryTree();
  const [currentCategory, setCurrentCategory] = useState();

  useEffect(() => {
    setCurrentListCategory(currentCategory);
  }, [currentCategory, setCurrentListCategory]);
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

  const onCategoryNavClick = useCallback((category) => {
    setSubCategories(category.children);
    window.scrollTo(0, 0)
  }, [setSubCategories]);

  const onCategoryLoadClick = useCallback((e, id) => {
    e.preventDefault();
    setCurrentCategory(id);
  }, [setCurrentCategory]);

  return (
    <GeneralTemplate>
      <div ref={prodcompRef}
        className="product-comparison"
      >
        <div className="container" style={{ paddingLeft: '280px' }}>
          <div className="product-comparison__list" style={{ zIndex: -1 }}>

            {/* ---- TEST BLOCK */}
            <nav style={{
              position: 'sticky',
              top: '61px',
              height: 50,
              width: 1045,
              backgroundColor: '#212121',
              border: '1px solid white',
              borderRadius: 6,
              zIndex: 2,
              marginLeft: -5,
              marginBottom: -46,
            }}>
              <ul style={{
                display: 'flex',
                columnGap: 23,
                padding: 10,
                position: 'sticky',
                zIndex: 3,
              }} >
                {
                  categoryTree.map((category, index) => (
                    <li key={category.id}>
                      <button className={["buttonStyle", currentCategory ? category.id === currentCategory ? "button-active" : ""
                        : index === 0 ? "button-active" : ""].join(" ")}
                        onClick={(e) => { onCategoryLoadClick(e, category.id); onCategoryNavClick(category); }}
                      >
                        <IfindIcon icon={category.icon} style={{ height: 15, width: 15, marginRight: 5 }} />
                        <span>{(category.label.label).split(" ")[0]}</span>
                      </button>
                    </li>
                  ))
                }
              </ul>
            </nav>
            {/* ---- END TEST BLOCK */}

            {loading && <span className="loading"><img src={icon} className="loading-icon" alt="icon" /></span>}
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
      <div>
        <Carousel categories={categoryTree}
          currentCategory={currentCategory}
          onCategoryLoadClick={onCategoryLoadClick}
          onCategoryNavClick={onCategoryNavClick}
        />
      </div>
    </GeneralTemplate >
  )
});

// TODO: Remove ProductComparisonContextProvider altogether once integrated in FE
export default withComponentName('ProductComparisonPage')((props) => (
  <ProductComparisonContextProvider>
    <ProductComparison {...props} />
  </ProductComparisonContextProvider>
));
