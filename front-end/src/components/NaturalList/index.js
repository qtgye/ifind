import { useState, useCallback, useEffect } from 'react';
import { useFetchProductDetail } from '@contexts/productContext';
import ProductDetails from '@components/ProductDetails';
import Item from './item';

import './natural-list.scss';

const NaturalList = ({ items = [], loading = false }) => {
    const icon = '/images/loading.png';
    const [activeProduct, setActiveProduct] = useState(null);
    const [detailsHTML, setDetailsHTML] = useState(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const { productDetail, refetchProductDetail } = useFetchProductDetail(activeProduct?.id);

    const onProductClick = useCallback((product) => {
        setActiveProduct(product);
    }, [setActiveProduct]);

    const onProductDetailUpate = useCallback(() => {
        if (activeProduct && productDetail) {
            if (productDetail.id === activeProduct.id) {
                setActiveProduct({
                    ...activeProduct,
                    ...productDetail
                });
            }
        }
    }, [ productDetail, activeProduct ])

    useEffect(() => {
        if (activeProduct) {
            if (activeProduct.detailHTML) {
                setDetailsHTML(activeProduct.detailHTML);
                setIsDetailsLoading(false);
            }
            else {
                setIsDetailsLoading(true);
            }
        }
    }, [activeProduct, refetchProductDetail]);

    useEffect(() => {
        onProductDetailUpate();
    }, [productDetail]); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div className="natural-list">
            { loading && <span className="loading"><img src={icon} className="loading-icon" alt="icon" /></span>}
            <div className="natural-list__content">
                {!loading && (
                    <ul className="natural-list__grid">
                        <li className="natural-list__item">
                            {
                                activeProduct &&
                                <ProductDetails
                                    detailsHTML={detailsHTML}
                                    urlList={activeProduct?.url_list}
                                    title={activeProduct.title}
                                    isLoading={isDetailsLoading}
                                />
                            }

                        </li>
                        {items.map((item, index) => (
                            <Item
                                {...item}
                                active={activeProduct && activeProduct.url === item.url}
                                withBadge={index === 0}
                                onClick={() => onProductClick(item)}
                                key={item.id}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
};

export default NaturalList;