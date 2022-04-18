import React from "react";
import { Link } from "react-router-dom";
import { useDrag, useDrop } from "react-sortly";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { generatePluginLink } from "../../helpers/url";
import IfindIcon from "../IFINDIcon";
import ProductListLink from "./product-list-link";

const ItemRenderer = ({
  data: { id, label, depth, softParent, icon, products_count },
}) => {
  const [, drag] = useDrag();
  const [{ hovered }, drop] = useDrop();

  return (
    <>
      <div
        className="category-tree__item"
        data-hovered={hovered}
        ref={drop}
        data-depth={depth}
        data-id={id}
        data-soft-parent={softParent}
      >
        <div className="category-tree__item-info" ref={drag}>
          <div className="category-tree__drag">
            {icon && <IfindIcon className="category-tree__icon" icon={icon} />}
          </div>
          <div className="category-tree__details">
            <Link to={generatePluginLink(`categories/${id}`)}>
              [{id}] {label}
              <FontAwesomeIcon
                className="category-tree__item-edit-icon"
                icon="pen"
              />
            </Link>
          </div>
          {(products_count && (
            <ProductListLink count={products_count} category={id} />
          )) ||
            ""}
        </div>
      </div>
    </>
  );
};

export default ItemRenderer;
