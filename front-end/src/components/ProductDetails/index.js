import { useState, useEffect } from 'react';
import ReactShadowRoot from 'react-shadow-root';
import { toAdminURL } from '@utilities/url';
import { v4 as uuid } from 'uuid';

import './product-details.scss';

import inlineStyles from './detail-styles';

const ProductURLLink = ({ url, logo, price, isBase, basePrice }) => {
    const percentDifference = 100 * (price - basePrice ) / basePrice;

    return  (
        <div className="product-details__link-item">
            <a href={url} className="product-details__link" target="_blank" rel="noreferrer">
                <img src={toAdminURL(logo)} alt="" className="product-details__link-image" />
            </a>
            <span className="product-details__price">{price}</span>
            {
                !isBase && (
                    <span className={[ 'product-details__diff', percentDifference < 0 ? 'product-details__diff--lower' : 'product-details__diff--higher' ].join(' ')}>
                        {percentDifference.toFixed(2)}%
                    </span>
                )
            }
        </div>
    )
}

const ProductDetails = ({ detailsHTML, title, urlList = [], isLoading }) => {
    const [ basePrice, setBasePrice ] = useState(0);
    const [ urlItems, setURLItems ] = useState([]);

    useEffect(() => {
        const baseURLData = urlList.find(({ is_base }) => is_base);

        if ( baseURLData ) {
            setBasePrice(Number(baseURLData.price));
        }

        // Add keys to urlList
        setURLItems(urlList.map(urlData => ({
            ...urlData,
            key: uuid(),
        })))

    }, [ urlList ]);


    return (
        <div className="product-details">
            <ReactShadowRoot>
                { isLoading && (<h1>Loading...</h1>) }
                { !isLoading && (
                    <div className="product-details__content">
                        <style>{inlineStyles}</style>
                        <h1 className="product-details__title">{title}</h1>
                        <div className="product-details__body" dangerouslySetInnerHTML={{ __html: detailsHTML }}></div>
                        <div className="product-details__links">
                            {urlItems.map(({ key, url, source, price, is_base }) => (
                                <ProductURLLink
                                    key={key}
                                    url={url}
                                    logo={source?.button_logo?.url}
                                    price={price}
                                    isBase={is_base}
                                    basePrice={basePrice}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </ReactShadowRoot>
        </div>
    )
}

export default ProductDetails;