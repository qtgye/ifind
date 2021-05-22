import './product-details.scss';

const ProductDetails = ({ detailsHTML, isLoading }) => {
    return (
        <div className="product-details">
            { isLoading && (<h1>Loading...</h1>) }
            { !isLoading && <div className="product-details__content" dangerouslySetInnerHTML={{ __html: detailsHTML }}></div> }
        </div>
    )
}

export default ProductDetails;