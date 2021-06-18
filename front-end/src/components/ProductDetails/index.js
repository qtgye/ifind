import { useRef, useEffect } from 'react';
import ReactShadowRoot from 'react-shadow-root';

import './product-details.scss';

import inlineStyles from './detail-styles';

const ProductDetails = ({ detailsHTML, title, isLoading }) => {
    const productDetailsRef = useRef();

    useEffect(() => {
        if ( productDetailsRef.current ) {
            // productDetailsRef.current.attachShadow({ mode: 'open' });
        }
    }, [ productDetailsRef ]);

    return (
        <div className="product-details">
            <ReactShadowRoot>
                { isLoading && (<h1>Loading...</h1>) }
                { !isLoading && (
                    <div className="product-details__content">
                        <style>{inlineStyles}</style>
                        <h1 className="product-details__title">{title}</h1>
                        <div className="product-details__body" dangerouslySetInnerHTML={{ __html: detailsHTML }}></div>
                    </div>
                )}
            </ReactShadowRoot>
        </div>
    )
}

export default ProductDetails;