import { useCallback } from "react";
import PreloadedImage from "@components/PreloadedImage";
import RenderIf from "@components/RenderIf";

const Item = ({
  active,
  image,
  title,
  price,
  withBadge,
  onClick,
  index,
}: NaturalListItemProps) => {
  const itemClassnames = [
    "natural-list__item",
    active && "natural-list__item--active ",
  ].filter(Boolean);

  // Parses image URL, and replaces with lower size image
  // For optimal thumbnail image size
  // NOTE - Only matches amazon's image url format. Other URL format may have no change at all.
  const smallerImage = useCallback(
    (imageURL: string = "") => {
      // Determine proper image size for specific item
      const size = index > 2 ? 80 : index > 1 ? 150 : index > 0 ? 220 : 350;

      return imageURL.replace(/\d+_\.jpg$/i, `${size}_.jpg`);
    },
    [index]
  );

  return (
    <li className={itemClassnames.join(" ")} onClick={onClick}>
      <figure className="natural-list__figure">
        <PreloadedImage
          className="img natural-list__image"
          src={smallerImage(image)}
          alt=""
        />
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
