import BasicPage from '@templates/BasicPage';
import { withComponentName } from '@utilities/component';
import List from './List';
import { useContext, useCallback, useRef } from 'react';
import { GlobalStateContext } from '@contexts/globalStateContext';

const ProductComparison = () => {

  const { setActiveIndex } = useContext(GlobalStateContext);
  let options = {
    root: document.querySelector('prodcomp-area'),
    rootMargin: '0px',
    threshold: 0.60,
  }

  const onIntersect = useCallback(([intersection]) => {
    const { target, isIntersecting } = intersection;

    if (isIntersecting) {
      const index = target.dataset.index;
      setActiveIndex(index);
      console.log(index);
    }
  }, [setActiveIndex]);

  const observerRef = useRef(new IntersectionObserver(onIntersect, options));

  const observeItem = useCallback((element) => {
    observerRef.current.observe(element);
    return () => {
      observerRef.current.unobserve(element);
    }
  }, [observerRef]);

  return (
    <BasicPage title="Product Comparison" >
      <div className="prodcomp-area">
        {Array.from({ length: 10 }).map((item, index) => (
          <List key={index} observeItem={observeItem} index={index} />
        ))}
      </div>
    </BasicPage >
  );

};

export default withComponentName('ProductComparisonPage')(ProductComparison);