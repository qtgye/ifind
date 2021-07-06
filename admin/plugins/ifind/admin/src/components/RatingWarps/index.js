import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IFINDIcon from '../IFINDIcon';

import './styles.scss';

const RatingWarps = ({ rating = 0, onChange }) => {
  const widthPercent = rating / 10 * 100;

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
    <div className="rating-warps">
      <button
        className="rating-warps__control rating-warps__control--subtract"
        onClick={(e) => onSubtract(e)}
        disabled={rating === 0}
      ><FontAwesomeIcon icon='minus' /></button>
      <div className="rating-warps__graphic">
        <div className="rating-warps__warps rating-warps__warps--fg" style={{ width: `${widthPercent}%` }}>{Array.from({ length: 5}).map(() => <IFINDIcon icon='warp' />)}</div>
        <div className="rating-warps__warps rating-warps__warps--bg">{Array.from({ length: 5}).map(() => <IFINDIcon icon='warp' />)}</div>
      </div>
      <button
        className="rating-warps__control rating-warps__control--add"
        onClick={(e) => onAdd(e)}
        disabled={rating === 10}
      ><FontAwesomeIcon icon='plus' /></button>
    </div>
  )
}

export default RatingWarps;