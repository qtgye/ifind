import { useState, useCallback } from 'react';
import ProductDetails from '@components/ProductDetails';

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
                        <li className="natural-list__item" key={index} onClick={() => onProductClick(item)}>
                            <figure className="natural-list__figure">
                                <img className="img natural-list__image" src={item.image} alt={`${item.title} image`} />
                                <figcaption className="natural-list__title">{item.title}</figcaption>
                            </figure>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
};

export default NaturalList;