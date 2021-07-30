import { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { apiSourceHandle } from '@config/adminApi'
import getProductDetailQuery from '@gql/getProductDetailQuery';
import incrementProductClickMutation from '@gql/incrementProductClickMutation';

import { locale } from '@config/locale';

export const ProductContext = createContext({});

export const ProductContextProvider = ({ children }) => {
    const [ productDetail, setProductDetail ] = useState(null);
    const [ productID, setProductID ] = useState('');
    const {
        // loading,
        // error,
        data,
        refetch
    } = useQuery(getProductDetailQuery, {
        context: {
            apiSource: apiSourceHandle,
        },
        variables: { 
            id: productID,
            language: locale,
        }
    });
    const [mutationFunction, { data: mutationData, loading, error }] = useMutation(incrementProductClickMutation);

    const fetchProductDetail = useCallback(( productID ) => {
        setProductID(productID);
    }, [ setProductID ]);

    const incrementProductClick = useCallback((id) => {
        mutationFunction({
            variables: { id},
            context: {
                apiSource: apiSourceHandle,
            },
        });
    }, [ mutationFunction ]);

    useEffect(() => {
        refetch();
    }, [ productID, refetch ]);

    useEffect(() => {
        setProductDetail(data?.productDetails);
    }, [ data ]);

    return (
        <ProductContext.Provider value={{
            productDetail,
            fetchProductDetail,
            incrementProductClick,
        }}>
            {children}
        </ProductContext.Provider>
    )
}

export const useFetchProductDetail = (productID) => {
    const {
        // loading,
        // error,
        data,
        refetch
    } = useQuery(getProductDetailQuery, {
        context: {
            apiSource: apiSourceHandle,
        },
        variables: { 
            id: productID,
            language: locale,
        }
    });
    const [ productDetail, setProductDetail ] = useState(null);

    useEffect(() => {
        setProductDetail(data?.productDetails);
    }, [ data ]);
    
    return {
        productDetail,
        refetchProductDetail: refetch
    };
};

export const useProductDetail = () => {
    const context = useContext(ProductContext);
    return context;
}

// Export as default to be used in testing
export default ProductContext;