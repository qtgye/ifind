import GeneralTemplate from '@templates/GeneralTemplate';
import { withComponentName, withProvider } from '@utilities/component';
import { useProductComparison } from '@contexts/productComparisonContext';

import NaturalList from '@components/NaturalList';

const ProductComparison = () => {
  const { productComparisonList } = useProductComparison();

  console.log({ productComparisonList });

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