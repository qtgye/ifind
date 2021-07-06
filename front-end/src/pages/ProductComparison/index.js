// import BasicPage from '@templates/BasicPage';
// import { withComponentName } from '@utilities/component';
// import List from './List';
// import { useContext, useCallback, useRef } from 'react';
// import { GlobalStateContext } from '@contexts/globalStateContext';

// const ProductComparison = () => {

//   const { setActiveIndex } = useContext(GlobalStateContext);
//   let options = {
//     root: document.querySelector('prodcomp-area'),
//     rootMargin: '0px',
//     threshold: 0.60,
//   }

//   const onIntersect = useCallback(([intersection]) => {
//     const { target, isIntersecting } = intersection;

//     if (isIntersecting) {
//       const index = target.dataset.index;
//       setActiveIndex(index);
//       console.log(index);
//     }
//   }, [setActiveIndex]);

// const observerRef = useRef(new IntersectionObserver(onIntersect, options));

// const observeItem = useCallback((element) => {
//   observerRef.current.observe(element);
//   return () => {
//     observerRef.current.unobserve(element);
//   }
// }, [observerRef]);

//   return (
//     <BasicPage title="Product Comparison" >
//       <div className="prodcomp-area">
//         {Array.from({ length: 10 }).map((item, index) => (
//           <List key={index} observeItem={observeItem} index={index} />
//         ))}
//       </div>
//     </BasicPage >
//   );

// };

import GeneralTemplate from '@templates/GeneralTemplate';
import { withComponentName, withProvider } from '@utilities/component';
import { useProductComparison } from '@contexts/productComparisonContext';
import { useContext, useCallback, useRef } from 'react';
import { GlobalStateContext } from '@contexts/globalStateContext';
import NaturalList from '@components/NaturalList';


const ProductComparison = () => {
  const { productComparisonList } = useProductComparison();

  const { setActiveIndex } = useContext(GlobalStateContext);
  // let options = {
  //   root: document.querySelector('prodcomp-area'),
  //   rootMargin: '0px',
  //   threshold: 0.60,
  // }

  const onIntersect = useCallback(([intersection]) => {
    const { target, isIntersecting } = intersection;

    if (isIntersecting) {
      const index = target.dataset.index;
      setActiveIndex(index);
      console.log(index);
    }
  }, [setActiveIndex]);

  // const observerRef = useRef(new IntersectionObserver(onIntersect, options));
  const observerRef = useRef(new IntersectionObserver(onIntersect));

  const observeItem = useCallback((e) => {
    observerRef.current.observe(e);
    return () => {
      observerRef.current.unobserve(e);
    }
  }, [observerRef]);

  return (
    <GeneralTemplate>
      <div className="product-comparison">
        <div className="container" style={{ paddingLeft: '280px' }}>
          <div className="product-comparison__list">
            {
              productComparisonList.map(({ category, products }) => (
                <NaturalList
                  key={category.id}
                  items={products}
                  observeItem={observeItem}
                  id={category.id}
                  label={category.label.label}
                />
              ))
            }
          </div>
        </div>
      </div>
    </GeneralTemplate>
  )
};

export default withProvider('ProductComparisonContextProvider')(withComponentName('ProductComparisonPage')(ProductComparison));