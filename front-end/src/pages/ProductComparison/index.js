import { useEffect, useState } from 'react';
import GeneralTemplate from '@templates/GeneralTemplate';
import { withComponentName } from '@utilities/component';
import { ProductComparisonContextProvider, useProductComparison } from '@contexts/productComparisonContext';
import { useContext, useCallback, useRef } from 'react';
import { GlobalStateContext } from '@contexts/globalStateContext';
import NaturalList from '@components/NaturalList';
import IfindIcon from '@components/IfindIcon';

import './product-comparison.scss';
import { useCategoryTree } from '@contexts/categoriesContext';
import { useSubCategories } from '../../contexts/categoriesContext';
import Carousel from '../../components/Carousel';

const ProductComparison = withComponentName('ProductComparisonPage')(() => {
  const { productComparisonList, setCurrentListCategory, loading } = useProductComparison();
  const icon = '/images/loading.png';
  const prodcompRef = useRef();
  const { setSubCategories } = useSubCategories();

  const categoryTree = useCategoryTree();
  const [currentCategory, setCurrentCategory] = useState();

  useEffect(() => {
    setCurrentListCategory(currentCategory);
  }, [currentCategory, setCurrentListCategory]);

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
        className="product-comparison">
        <div className="container" style={{ paddingLeft: 280 }}>
          <div className="list">
            <nav className="nav">
              <ul className="nav-list" >
                {
                  categoryTree.map((category, index) => (
                    <li key={category.id}>
                      <button className={["buttonStyle", currentCategory ? category.id === currentCategory ? "button-active" : ""
                        : index === 0 ? "button-active" : ""].join(" ")}
                        onClick={(e) => { onCategoryLoadClick(e, category.id); onCategoryNavClick(category); }}
                      >
                        <IfindIcon icon={category.icon} className="category-icons" />
                        <span>{(category.label.label).split(" ")[0]}</span>
                      </button>
                    </li>
                  ))
                }
              </ul>
            </nav>

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
