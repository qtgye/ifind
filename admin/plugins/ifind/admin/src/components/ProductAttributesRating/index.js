import React, { useState, useEffect, useCallback } from 'react';

import { useCategoriesListing } from '../../providers/categoriesListingProvider';
import { useProductAttributes } from '../../providers/productAttributesProvider';
import RatingWarpsControl from '../RatingWarpsControl';
import RatingWarps from '../RatingWarps';
import NumberInput from '../NumberInput';

const RATING_INCREMENTS = 0.5;

import './styles.scss';

const AttributeRating = ({ product_attribute, factor, rating = 0, points, onChange }) => {
  const onRatingChange = useCallback((newRating) => {
    if ( typeof onChange === 'function' ) {
      const rating = Number(Number(newRating).toFixed(3));
      const normalizedRating = rating >= 10 ? 10 :
                               rating <= 0 ? 0 :
                               rating;

      onChange({
        rating: normalizedRating,
        points: Number(factor) * rating,
        product_attribute,
        factor,
      });
    }
  }, [ onChange ]);

  return (
    <tr className="attribute-rating">
      <td>{product_attribute.name}</td>
      <td>
        <NumberInput
          className="attribute-rating__input"
          value={Number(rating.toFixed(2))}
          onChange={value => onRatingChange(value)}
          max={10}
          step={RATING_INCREMENTS}
        />
      </td>
      <td>
        <RatingWarpsControl
          rating={rating}
          onChange={newRating => onRatingChange(newRating)} />
      </td>
      <td>{factor}</td>
      <td>{Number(points.toFixed(2))}</td>
    </tr>
  )
}

const ProductAttributesRating = ({ category, attributesRatings = [], onAttributesChange, onFinalRatingChange, className }) => {
  const { categories } = useCategoriesListing();
  const { productAttributes } = useProductAttributes();
  const [ attrsDetails, setAttrsDetails ] = useState([]);
  const [ totalRating, setTotalRating ] = useState(0);

  const onAttrRatingChange = useCallback((changedAttrRating) => {
    // Updated changed attrDetail
    const newAttrDetails = attrsDetails.map(attrDetail => {
      return attrDetail.product_attribute.id === changedAttrRating.product_attribute.id ?
      {
        ...attrDetail,
        ...changedAttrRating,
      } : 
      attrDetail
    });

    if ( typeof onAttributesChange === 'function' ) {
      onAttributesChange(newAttrDetails);
    }
  }, [ attrsDetails, totalRating ]);

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
        attrWithFactor.rating = 0;
      }

      // Compute points
      attrWithFactor.points = Number(attrWithFactor.rating) * Number(attrWithFactor.factor);

      return attrWithFactor;
    });

    setAttrsDetails([...attrsWithWithRatings]);
  }, [ categories, productAttributes, category, attributesRatings ]);

  // Set total points according to product attributes factors
  useEffect(() => {
    if ( attrsDetails.length ) {
      let totalPoints = 0;
      let totalRating = 0;

      attrsDetails.forEach((attrDetail) => {
        totalPoints += Number(attrDetail.factor) * 10;
        totalRating += attrDetail.points;
      });

      const finalRating = Number((10 * totalRating / totalPoints).toFixed(2));
      setTotalRating(finalRating);

      if ( typeof onFinalRatingChange === 'function' ) {
        onFinalRatingChange(finalRating);
      }
    }
  }, [ attrsDetails ]);


  return (
    <div className={[
      'product-attributes-rating',
      className
    ].join(' ')}>

      {/* Totals */}
      <div className="product-attributes-rating__total">
        <strong>Rating:</strong>
        <div className="product-attributes-rating__figure">
          <RatingWarps percentage={100 * totalRating / 10} />
          <strong className="product-attributes-rating__ratio">{totalRating}/10</strong>
        </div>
      </div>

      <table className="product-attributes-rating__table">
        <thead>
          <th>Attribute</th>
          <th>Rating</th>
          <th></th>
          <th>Factor</th>
          <th>Points</th>
        </thead>
        <tbody>
          {
            attrsDetails.map(attrRating => (
              <AttributeRating
                {...attrRating}
                key={attrRating.product_attribute.id}
                onChange={changedRating => onAttrRatingChange(changedRating)}
                />
            ))
          }
        </tbody>
      </table>
    </div>
  )
};

export default ProductAttributesRating;