import Modal from "@components/Modal";
import { useEffect, useState } from "react";
import { useProductDetail } from "@contexts/productContext";
import IfindLoading from "@components/IfindLoading";
import ProductLinks from "@components/ProductLinks";
import PriceChangeGraph from "@components/PriceChangeGraph";
import ProductRating from "@components/ProductRating";

import "./styles.scss";

const ProductModal = ({ product, ...modalProps }: ProductModalProps) => {
  const {
    productDetail,
    getProductDetails,
    loading = true,
  } = useProductDetail();
  const productChanges =
    productDetail?.product_changes?.map((productChange) => {
      return {
        ...productChange,
        state: JSON.parse(productChange?.state || "{}"),
      } as ProductChangeWithStateObject;
    }) || [];

  const classNames = ["product-modal", loading ? "product-modal--loading" : ""]
    .filter(Boolean)
    .join();

  useEffect(() => {
    if (product?.id && getProductDetails) {
      getProductDetails(product?.id);
    }
  }, [product, getProductDetails]);

  return (
    <Modal className={classNames} {...modalProps}>
      <IfindLoading />
      <div className="product-modal__details">
        <div className="product-modal__content">
          <h2 className="product-modal__heading">{product?.title}</h2>
          <div className="product-modal__info">
            <div className="product-modal__image">
              <img src={product?.image} alt="" className="" />
            </div>
            <div className="product-modal__links">
              <ProductLinks product={productDetail} />
            </div>
          </div>
          <div className="product-modal__details">
            <div className="product-modal__rating">
              <ProductRating
                renderIf={typeof productDetail?.final_rating === 'number'}
                finalRating={productDetail?.final_rating || 0}
                attributes={productDetail?.attrs_rating || []}
              />
            </div>
            <div className="product-modal__price-graph">
              <PriceChangeGraph
                renderIf={productChanges.length > 0}
                priceChanges={productChanges.map(
                  (productChange) =>
                    productChange && {
                      price: productChange?.state?.price || 0,
                      date_time: productChange.date_time,
                    }
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductModal;
