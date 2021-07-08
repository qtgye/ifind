import { useState, useCallback, useEffect } from 'react';
import ProductDetails from '@components/ProductDetails';
import Item from './item';

import './natural-list.scss';

const NaturalList = ({ items = [], loading = false, category }) => {
    const icon = '/images/loading.png';
    const [activeProduct, setActiveProduct] = useState(null);
    const [detailsHTML, setDetailsHTML] = useState(null);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);

    const onProductClick = useCallback((product) => {
        setActiveProduct(product);
    }, [setActiveProduct]);

    useEffect(() => {
        if (activeProduct) {
            if (activeProduct.details_html) {
                setDetailsHTML(activeProduct.details_html);
            }
            setIsDetailsLoading(false);
        }
    }, [activeProduct]);

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