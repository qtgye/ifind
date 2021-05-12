import { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { useQuery } from "@apollo/react-hooks";
import getProductDetailQuery from '@gql/getProductDetailQuery';

export const ProductContext = createContext({});

export const ProductContextProvider = ({ children }) => {
    const [ productDetailURL, setProductDetailURL ] = useState('');
    const {
        // loading,
        // error,
        data,
        refetch
    } = useQuery(getProductDetailQuery, {
        variables: { productDetailURL }
    });

    const fetchProductDetail = useCallback(( detailURL ) => {
        setProductDetailURL(detailURL);
    }, [ setProductDetailURL ]);

    useEffect(() => {
        refetch();
    }, [ productDetailURL, refetch ]);

    return (
        <ProductContext.Provider value={{ productDetail: data?.productDetail, fetchProductDetail }}>
            {children}
        </ProductContext.Provider>
    )
}

export const useProductDetail = () => {
    const context = useContext(ProductContext);
    return context;
}

// Export as default to be used in testing
export default ProductContext;