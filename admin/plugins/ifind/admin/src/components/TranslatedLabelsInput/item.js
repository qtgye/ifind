import React, { useCallback, useEffect, useState } from 'react';
import { Label} from '@buffetjs/core';

import InputBlock from '../InputBlock';
import TextInput from '../TextInput';

const Item = ({ itemKey, language, label, onChange }) => {
  const onLabelChange = useCallback((value) => {
    if ( typeof onChange === 'function' ) {
      onChange({
        key: itemKey,
        language,
        label: value,
      });
    }
  }, [ language, itemKey, onChange ]);

  return (
    <div className="translated-labels-input__item">
      <InputBlock className='translated-labels-input__language'>
        <Label>Language</Label>
      </InputBlock>
      <TextInput
        value={label}
        onChange={onLabelChange}
        label='Label'
        className='translated-labels-input__label'
      />
    </div>
  );
}

export default Item;