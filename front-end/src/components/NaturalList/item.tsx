import PreloadedImage from '@components/PreloadedImage';
import RenderIf from '@components/RenderIf';

const Item = ({ active, image, title, price, withBadge, onClick }: NaturalListItemProps) => {
    const itemClassnames = [
        'natural-list__item',
        active && 'natural-list__item--active ',
    ].filter(Boolean);

    return (
        <li className={itemClassnames.join(' ')} onClick={onClick}>
            <figure className="natural-list__figure">
                <PreloadedImage className="img natural-list__image" src={image} alt="" />
                <div className="price-per-product">
                    <span>{price} €</span>
                </div>
                <RenderIf condition={withBadge || false}>
                  <span className="natural-list__badge">Best Seller</span>
                </RenderIf>
            </figure>
        </li>
    );
};

export default Item;
