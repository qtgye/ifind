import { useState, useCallback } from 'react';
import ProductDetails from '@components/ProductDetails';
import Item from './item';

import './natural-list.scss';

const NaturalList = ({ items }) => {
    const [ activeProduct, setActiveProduct ] = useState(null);

    const onProductClick = useCallback((product) => {
        setActiveProduct(product);
    }, [setActiveProduct]);


    return (
        <div className="natural-list">
            <div className="natural-list__content">
                <ul className="natural-list__grid">
                    <li className="natural-list__item">
                        {
                            activeProduct && 
                            <ProductDetails
                                title={activeProduct.title}
                                store={activeProduct.store}
                                ratingValue={activeProduct.ratingValue}
                                ratingsCount={activeProduct.ratingsCount}
                                category={activeProduct.category}
                                categoryRating={activeProduct.categoryRating}
                                details={activeProduct.details}
                            />
                        }
                        
                    </li>
                    {items.map((item, index) => (
                        <Item 
                            {...item}
                            active={activeProduct && activeProduct.id === item.id}
                            withBadge={index === 0}
                            onClick={() => onProductClick(item)}
                            key={index}
                        />
                    ))}
                </ul>
            </div>
        </div>
    )
};

export default NaturalList;