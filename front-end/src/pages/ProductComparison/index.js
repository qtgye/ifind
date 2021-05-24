import BasicPage from '@templates/BasicPage';
import { withComponentName } from '@utilities/component';

const ProductComparison = () => (
  <BasicPage title="Product Comparison" >
    Product Comparison works
  </BasicPage >
);

export default withComponentName('ProductComparisonPage')(ProductComparison);