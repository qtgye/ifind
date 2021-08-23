import { useContext, useState, useCallback, useEffect, useRef } from 'react';
import { find } from 'lodash';
import { useLocation } from 'react-router-dom';
import routes from '@config/routes';
import ProductDetails from '@components/ProductDetails';
import { GlobalStateContext } from '@contexts/globalStateContext';
import { useProductDetail } from '@contexts/productContext';
import Item from './item';

import './natural-list.scss';

const NaturalList = ({ items = [], loading = false, category, observeItem, id, label, date }) => {
    const { incrementProductClick, productDetail: productDetailFromContext, getProductDetails } = useProductDetail();

    const icon = '/images/loading.png';
    const [activeProduct, setActiveProduct] = useState(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);
    const { pathname } = useLocation();
    const currentRouteConfig = find(routes, ({ path }) => pathname === path);
    const { focusedCategory } = useContext(GlobalStateContext);
    const itemRef = useRef();

    const onProductClick = useCallback((product) => {
        setActiveProduct(product);
        incrementProductClick(product.id);
    }, [setActiveProduct, incrementProductClick]);

    const populateProductDetails = useCallback(async (productID) => {
        setIsDetailsLoading(true);
        getProductDetails(productID);
    }, [getProductDetails]);

    const productHasDetails = useCallback((productData) => (
        productData?.details_html ? true : false
    ), []);

    // Merge activeProduct and productDetails from the context
    const mergeCurrentProductDetails = useCallback(() => {
        if (activeProduct) {
            setActiveProduct({
                ...activeProduct,
                ...(productDetailFromContext || {}),
            });
        }
        setIsDetailsLoading(false);
    }, [productDetailFromContext, activeProduct]);

    // When product details update from context,
    // Merge it with activeProduct
    useEffect(() => {
        mergeCurrentProductDetails();
    }, [productDetailFromContext]); // eslint-disable-line react-hooks/exhaustive-deps

    // When a product is selected,
    // Determine whether it has details
    useEffect(() => {
        if (activeProduct && !productHasDetails(activeProduct)) {
            populateProductDetails(activeProduct.id);
        }
    }, [activeProduct]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (observeItem && itemRef) {
            const unObserve = observeItem(itemRef.current);
            return unObserve;
        }
    }, [observeItem, itemRef]);

    useEffect(() => {
        if (focusedCategory === id && itemRef.current) {
            const currentScroll = window.pageYOffset;
            const { top } = itemRef.current.getBoundingClientRect();
            const targetScroll = currentScroll + (top - 63);

            window.scrollTo(0, targetScroll);
        }
        //console.log(date);
    }, [focusedCategory, id]);

    const getQuarter = (date) => {
        date = new Date(date);
        let qtr = Math.ceil((date.getMonth() + 1) / 3);
        let yr = date.getFullYear();
        return ["Q" + qtr, "/" + yr];
    }

    return (
        <div className="natural-list">
            {currentRouteConfig.path === '/' ? null :
                <>
                    <div className="natural-list__separator" ref={itemRef} data-category={id}>
                        {label.toUpperCase()}
                        <div className="natural-list__mfd">
                            {getQuarter(date)}
                        </div>
                    </div>
                    <div className="left-arrow"><i className="fa fa-chevron-left"></i></div>
                    <div className="right-arrow"><i className="fa fa-chevron-right"></i></div>
                    {/* <div className="natural-list__price-cat"> */}
                    <div className="price-cat">
                        <button>$</button>
                        <button>$$</button>
                        <button>$$$</button>
                    </div>
                </>
            }
            {currentRouteConfig.path === '/findtube' ? null : (
                <>
                    {loading && <span className="loading"><img src={icon} className="loading-icon" alt="icon" /></span>}
                    <div className="natural-list__content" >
                        {!loading && (
                            <ul className="natural-list__grid">
                                <li className="natural-list__item">
                                    {
                                        activeProduct &&
                                        <ProductDetails
                                            product={activeProduct}
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
                </>
            )
            }
        </div>
    )
};

export default NaturalList;