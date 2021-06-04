import { useState, useCallback, useEffect } from 'react';
import { useProductDetail } from '@contexts/productContext';
import ProductDetails from '@components/ProductDetails';
import Item from './item';

import './natural-list.scss';

const NaturalList = ({ items = [], loading = true }) => {
    const icon = '/images/loading.png';
    const { productDetail, fetchProductDetail } = useProductDetail();
    const [activeProduct, setActiveProduct] = useState(null);
    const [detailsHTML, setDetailsHTML] = useState(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);

    const onProductClick = useCallback((product) => {
        setActiveProduct(product);
    }, [setActiveProduct]);

    useEffect(() => {
        if (activeProduct) {
            if (activeProduct.detailsHTML) {
                setDetailsHTML(activeProduct.detailsHTML);
                setIsDetailsLoading(false);
            }
            else if (activeProduct.detailURL) {
                setIsDetailsLoading(true);
                fetchProductDetail(activeProduct.detailURL);
            }
        }
    }, [activeProduct, fetchProductDetail]);

    useEffect(() => {
        if (activeProduct && productDetail) {
            if (productDetail.detailURL === activeProduct.detailURL) {
                setActiveProduct({
                    ...activeProduct,
                    ...productDetail
                });
            }
        }
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
                                    isLoading={isDetailsLoading}
                                />
                            }

                        </li>
                        {items.map((item, index) => (
                            <Item
                                {...item}
                                active={activeProduct && activeProduct.detailURL === item.detailURL}
                                withBadge={index === 0}
                                onClick={() => onProductClick(item)}
                                key={index}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
};

export default NaturalList;