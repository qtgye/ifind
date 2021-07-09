import { useState, useEffect } from 'react';
import ReactShadowRoot from 'react-shadow-root';
import { toAdminURL } from '@utilities/url';
import { v4 as uuid } from 'uuid';

import { useGlobalData } from '@contexts/globalDataContext';
import { useSourceRegion } from '@contexts/sourceRegionContext';

import './product-details.scss';

import inlineStyles from './detail-styles';

const ProductURLLink = ({ url, logo, price, isBase, basePrice, currency }) => {
    const percentDifference = 100 * (price - basePrice ) / basePrice;
    const { withAmazonTags } = useGlobalData();

    return  (
        <div className="product-details__link-item">
            <a href={withAmazonTags(url)} className="product-details__link" target="_blank" rel="noreferrer">
                <img src={toAdminURL(logo)} alt="" className="product-details__link-image" />
            </a>
            <span className="product-details__price">{currency}&nbsp;{price}</span>
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

const ProductDetails = ({ productData, detailsHTML, title, urlList = [], isLoading }) => {
    const { sources } = useSourceRegion();
    const amazonSource = sources.find(source => /amazon/i.test(source.name));
    const [ urlItems, setURLItems ] = useState([]);

    useEffect(() => {
        // Add keys to urlList
        setURLItems(productData.url_list?.map(urlData => ({
            ...urlData,
            key: uuid(),
        })))

    }, [ productData ]);

    console.log({ amazonSource });


    return (
        <div className="product-details">
            <ReactShadowRoot>
                { isLoading && (<h1>Loading...</h1>) }
                { !isLoading && (
                    <div className="product-details__content">
                        <style>{inlineStyles}</style>
                        <h1 className="product-details__title">{title}</h1>
                        <div className="product-details__body" dangerouslySetInnerHTML={{ __html: productData.details_html,  }}></div>
                        <div className="product-details__links">
                            <ProductURLLink
                                key={productData.amazon_url}
                                url={productData.amazon_url}
                                logo={amazonSource?.button_logo?.url}
                                price={productData.price}
                                isBase={true}
                                currency={productData.region?.currency?.symbol}
                            />
                            {urlItems.map(({ key, url, source, price, region, is_base }) => (
                                <ProductURLLink
                                    key={key}
                                    url={url}
                                    logo={source?.button_logo?.url}
                                    price={price}
                                    basePrice={productData.price}
                                    currency={productData.region?.currency?.symbol}
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