import React, { ReactNode, useEffect, useState } from "react";
import GeneralTemplate from "@templates/GeneralTemplate";
import { withComponentName } from "@utilities/component";
import {
  ProductComparisonContextProvider,
  useProductComparison,
} from "@contexts/productComparisonContext";
import { useContext, useCallback, useRef } from "react";
import { GlobalStateContext } from "@contexts/globalStateContext";
import NaturalList from "@components/NaturalList";
import IfindIcon from "@components/IfindIcon";

import "./product-comparison.scss";
import { useCategoryTree } from "@contexts/categoriesContext";
import { useSubCategories } from "../../contexts/categoriesContext";
//import Carousel from "../../components/Carousel";
import ProgressBars from "../../components/ProgressBar";

type ScrollableElement = HTMLElement & { scrollBehavior: string };

const ProductComparison: React.FunctionComponent<React.PropsWithChildren<ReactNode>> = () => {
  const {
    productComparisonList,
    setCurrentListCategory,
    loading,
  } = useProductComparison();
  const icon = "/images/loading.png";
  const prodcompRef = useRef<HTMLDivElement>();
  const navListRef = useRef<ScrollableElement>(document.getElementById("navlist") as ScrollableElement)
  const { setSubCategories } = useSubCategories();

  const categoryTree = useCategoryTree();
  const [currentCategory, setCurrentCategory] = useState();

  useEffect(() => {
    console.log({ categoryTree });
  }, [categoryTree]);

  useEffect(() => {
    if (setCurrentListCategory) {
      setCurrentListCategory(currentCategory);
    }
  }, [currentCategory, setCurrentListCategory]);

  const { setActiveCategory } = useContext(GlobalStateContext);
  let options = {
    root: document.querySelector("natural-list__content"),
    rootMargin: "0px",
    threshold: 0.02,
  };

  const onIntersect = useCallback(
    ([intersection]) => {
      const { target, isIntersecting } = intersection;

      if (isIntersecting && setActiveCategory) {
        const category = target.dataset.category;
        setActiveCategory(category);
      }
    },
    [setActiveCategory]
  );

  // const observerRef = useRef(new IntersectionObserver(onIntersect, options));
  const observerRef = useRef(new IntersectionObserver(onIntersect, options));

  const observeItem = useCallback(
    (e) => {
      observerRef.current.observe(e);
      return () => {
        observerRef.current.unobserve(e);
      };
    },
    [observerRef]
  );

  const onCategoryNavClick = useCallback(
    (category) => {
      if (setSubCategories) {
        setSubCategories(category.children);
        window.scrollTo(0, 0);
      }
    },
    [setSubCategories]
  );

  const onCategoryLoadClick = useCallback(
    (e, id) => {
      e.preventDefault();
      setCurrentCategory(id);
    },
    [setCurrentCategory]
  );

  const scrollToRight = () => {
    navListRef.current.scrollBehavior = "smooth";
    navListRef.current.scrollLeft += 50;

    return navListRef.current.scrollLeft;
  };

  const scrollToLeft = () => {
    navListRef.current.scrollBehavior = "smooth";
    navListRef.current.scrollLeft -= 50;

    return navListRef.current.scrollLeft;
  };

  return (
    <GeneralTemplate>
      <div ref={prodcompRef as React.LegacyRef<HTMLDivElement>} className="product-comparison">
        <div className="container">
          <div className="list">
            <nav className="nav">
              {navListRef.current?.scrollLeft === 0 ? (
                <div></div>
              ) : (
                <>
                  <div className="rarrow-area"></div>
                  <div
                    className="rarrow"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToLeft();
                    }}
                  >
                    <i className="fa fa-chevron-left"></i>
                  </div>
                </>
              )}
              <ul id="navlist" className="nav-list">
                {categoryTree?.map((category, index) => (
                  <li key={category?.id}>
                    <button
                      className={[
                        "buttonStyle",
                        currentCategory
                          ? category?.id === currentCategory
                            ? "button-active"
                            : ""
                          : index === 0
                            ? "button-active"
                            : "",
                      ].join(" ")}
                      onClick={(e) => {
                        onCategoryLoadClick(e, category?.id);
                        onCategoryNavClick(category);
                      }}
                    >
                      <IfindIcon
                        icon={category?.icon || ''}
                        className="category-icons"
                      />
                      <span>{category?.label?.label?.split(" ")[0]}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="larrow-area"></div>
              <div
                className="larrow"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToRight();
                }}
              >
                <i className="fa fa-chevron-right"></i>
              </div>
            </nav>

            {loading && (
              <span className="loading">
                <img src={icon} className="loading-icon" alt="icon" />
              </span>
            )}
            {loading && (
              <div className="progress">
                <ProgressBars />
              </div>
            )}
            {/* {loading && <span className="progress"><h2>Progress Bar</h2></span>} */}
            {!loading &&
              productComparisonList?.map(({ category, products }) => (
                <NaturalList
                  key={category?.id}
                  items={products ? products : []}
                  observeItem={observeItem}
                  id={category?.id || ''}
                  label={category?.label}
                  category={category}
                  date={category?.created_at}
                />
              ))}
          </div>
        </div>
      </div>
      {/* <div className="carousel-container">
        <Carousel
          categories={categoryTree ? categoryTree : []}
          currentCategory={currentCategory}
          onCategoryLoadClick={onCategoryLoadClick}
          onCategoryNavClick={onCategoryNavClick}
        />
      </div> */}
    </GeneralTemplate>
  );
};

// TODO: Remove ProductComparisonContextProvider altogether once integrated in FE
export default withComponentName("ProductComparisonPage")((props) => (
  <ProductComparisonContextProvider>
    <ProductComparison {...props} />
  </ProductComparisonContextProvider>
));
