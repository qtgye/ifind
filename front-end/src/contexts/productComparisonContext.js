import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from "@apollo/react-hooks";
import { locale } from '@config/locale';
import { apiSourceHandle } from '@config/adminApi';
import getProductComparisonListQuery from '@gql/getProductComparisonListQuery';

export const ProductComparisonContext = createContext({});

export const ProductComparisonContextProvider = ({ children }) => {
    const [productComparisonList, setProductComparisonList] = useState([]);
    const {
        data,
        loading,
        // error,
        // refetch
    } = useQuery(getProductComparisonListQuery, {
        variables: { language: locale },
        context: {
            apiSource: apiSourceHandle,
        }
    });

    useEffect(() => {
        if (data?.productComparisonList) {
            setProductComparisonList(data.productComparisonList);
        }
    }, [data]);

    return (
        <ProductComparisonContext.Provider value={{ productComparisonList, loading }}>
            {children}
        </ProductComparisonContext.Provider>
    )
}

ProductComparisonContextProvider.providerName = 'ProductComparisonContextProvider';

export const useProductComparison = () => {
    const context = useContext(ProductComparisonContext);
    return context;
}

// Export as default to be used in testing
export default ProductComparisonContext;
