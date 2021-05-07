import './product-details.scss';

const ProductDetails = ({ title, store, ratingValue, ratingsCount, category, categoryRating, details }) => {
    return (
        <div className="product-details">
            <div className="product-details__content">
                <h2 className="product-details__title">{title}</h2>
                <div className="product-details__links">
                    <a href={store.link} className="product-details__link">{store.name}</a>
                </div>
                <div className="product-details__rating">
                    {ratingValue} Stars - {ratingsCount} Ratings
                </div>
                <div className="product-details__meta">
                    {categoryRating} in {category}
                </div>
                <div className="product-details__details" dangerouslySetInnerHTML={{ __html: details }}></div>
            </div>
        </div>
    )
}

export default ProductDetails;