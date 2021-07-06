import { useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useFetchProductDetail } from '@contexts/productContext';
import ProductDetails from '@components/ProductDetails';
import { GlobalStateContext } from '@contexts/globalStateContext';
import Item from './item';

import './natural-list.scss';

const NaturalList = ({ items = [], loading = false, observeItem, id, label }) => {
    const icon = '/images/loading.png';
    const [activeProduct, setActiveProduct] = useState(null);
    const [detailsHTML, setDetailsHTML] = useState(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const { productDetail, refetchProductDetail } = useFetchProductDetail(activeProduct?.id);
    const { focusedIndex } = useContext(GlobalStateContext);
    const itemRef = useRef();

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
    }, [productDetail, activeProduct])

    useEffect(() => {
        if (activeProduct) {
            if (activeProduct.details_html) {
                setDetailsHTML(activeProduct.details_html);
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

    useEffect(() => {
        if (observeItem && itemRef) {
            const unObserve = observeItem(itemRef.current);
            return unObserve;
        }
    }, [observeItem, itemRef]);

    useEffect(() => {
        if (focusedIndex === id && itemRef.current) {
            const currentScroll = window.pageYOffset;
            const { top } = itemRef.current.getBoundingClientRect();
            const targetScroll = currentScroll + top;

            window.scrollTo(0, targetScroll);
        }
    }, [focusedIndex, id]);

    return (
        <div className="natural-list">
            <div className="natural-list__separator">
                <strong>{label}</strong>
            </div>
            <div className="natural-list__mfd">Q1/2021</div>
            {loading && <span className="loading"><img src={icon} className="loading-icon" alt="icon" /></span>}
            <div className="natural-list__content" ref={itemRef}>
                {!loading && (
                    <ul className="natural-list__grid">
                        <li className="natural-list__item">
                            {/* CategoryID: {id} */}
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
                                active={activeProduct && activeProduct.id === item.id}
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