import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RatingWarps from '../RatingWarps';

import './styles.scss';

const RatingWarpsControl = ({ rating = 0, onChange }) => {
  const percentage = rating / 10 * 100;

  const onSubtract = useCallback((e) => {
    e.preventDefault();
    if ( typeof onChange === 'function' ) {
      onChange( rating - 0.2 );
    }
  }, [ rating, onChange ]);

  const onAdd = useCallback((e) => {
    e.preventDefault();
    if ( typeof onChange === 'function' ) {
      onChange( rating + 0.2 );
    }
  }, [ rating, onChange ]);

  return (
    <div className="rating-warps-control">
      <button
        className="rating-warps-control__control rating-warps-control__control--subtract"
        onClick={(e) => onSubtract(e)}
        disabled={rating <= 0}
      ><FontAwesomeIcon icon='minus' /></button>
      <RatingWarps percentage={percentage} />
      <button
        className="rating-warps-control__control rating-warps-control__control--add"
        onClick={(e) => onAdd(e)}
        disabled={rating >= 10}
      ><FontAwesomeIcon icon='plus' /></button>
    </div>
  )
}

export default RatingWarpsControl;