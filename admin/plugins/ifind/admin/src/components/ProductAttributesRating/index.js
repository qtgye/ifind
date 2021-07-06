import React, { useState, useEffect, useCallback } from 'react';

import { useCategoriesListing } from '../../providers/categoriesListingProvider';
import { useProductAttributes } from '../../providers/productAttributesProvider';
import IFINDIcon from '../IFINDIcon';
import RatingWarps from '../RatingWarps';

import './styles.scss';

const AttributeRating = ({ product_attribute, factor, rating = 0, points, onChange }) => {
  const onRatingChange = useCallback((newRating) => {
    if ( typeof onChange === 'function' ) {
      onChange({
        rating: newRating,
        points: Number(factor) * newRating,
        product_attribute,
      });
    }
  }, [ onChange ]);

  return (
    <tr className="attribute-rating">
      <td>{product_attribute.name}</td>
      <td><strong>{Number(rating.toFixed(2))}</strong></td>
      <td>
        <RatingWarps
          rating={rating}
          onChange={newRating => onRatingChange(newRating)} />
      </td>
      <td>{factor}</td>
      <td>{Number(points.toFixed(2))}</td>
    </tr>
  )
}

const ProductAttributesRating = ({ category, attributesRatings = [], onChange, className }) => {
  const { categories } = useCategoriesListing();
  const { productAttributes } = useProductAttributes();
  const [ attrsDetails, setAttrsDetails ] = useState([]);

  const onAttrRatingChange = useCallback((changedAttrRating) => {
    // Updated changed attrDetail
    const newAttrDetails = attrsDetails.map(attrDetail => (
      attrDetail.product_attribute.id === changedAttrRating.product_attribute.id ?
      {
        ...attrDetail,
        ...changedAttrRating,
      } : 
      attrDetail
    ));

    if ( typeof onChange === 'function' ) {
      onChange(newAttrDetails);
    }
  }, [ attrsDetails ]);

  useEffect(() => {
    // - Get category product attrs
    //    - If none, use productAttributes
    // - Apply ratings from attributesRatings
    //    - If none, apply 1 for each attribute

    const matchedCategory = category ? categories.find(({ id }) => id === category) : null;
    const attrsWithFactors = matchedCategory?.product_attrs?.length ? matchedCategory.product_attrs : (
      (productAttributes || []).map(attr => ({
        product_attribute: attr,
        factor: 1,
      }))
    );

    // Supply rating and id from product's attributesRatings
    const attrsWithWithRatings = attrsWithFactors.map(attrWithFactor => {
      const matchedProductRating = attributesRatings.find(attrRating => (
        attrRating.product_attribute.id === attrWithFactor.product_attribute.id
      ));

      // Apply rating and id if there is any from product's rating
      if ( matchedProductRating ) {
        attrWithFactor.id = matchedProductRating.id;
        attrWithFactor.rating = matchedProductRating.rating;
      }
      // Else, apply defaults
      else {
        delete attrWithFactor.id;
        attrWithFactor.rating = 1;
      }

      // Compute points
      attrWithFactor.points = Number(attrWithFactor.rating) * Number(attrWithFactor.factor);

      return attrWithFactor;
    });

    setAttrsDetails([...attrsWithWithRatings]);
  }, [ categories, productAttributes, category, attributesRatings ]);

  return (
    <div className={[
      'product-attributes-rating',
      className
    ].join(' ')}>
      <table className="product-attributes-rating__table">
        <thead>
          <th>Attribute</th>
          <th>Rating</th>
          <th></th>
          <th>Factor</th>
          <th>Points</th>
        </thead>
        {
          attrsDetails.map(attrRating => (
            <AttributeRating
              {...attrRating}
              key={attrRating.product_attribute.id}
              onChange={changedRating => onAttrRatingChange(changedRating)}
              />
          ))
        }
      </table>
    </div>
  )
};

export default ProductAttributesRating;