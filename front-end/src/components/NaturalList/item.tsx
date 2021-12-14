import PreloadedImage from '@components/PreloadedImage';

const Item = ({ active, image, title, price, withBadge, onClick }: NaturalListItemProps) => {
    const itemClassnames = [
        'natural-list__item',
        active && 'natural-list__item--active ',
    ].filter(Boolean);

    return (
        <li className={itemClassnames.join(' ')} onClick={onClick}>
            <figure className="natural-list__figure">
                {/* <div className="natural-list__price"> */}
                <div className="price-per-product">
                    <span>{price} €</span>
                </div>
                <PreloadedImage className="img natural-list__image" src={image} alt="" />
                {withBadge && (
                    <span className="natural-list__badge">Best Seller</span>
                )}
            </figure>
        </li>
    );
};

export default Item;
