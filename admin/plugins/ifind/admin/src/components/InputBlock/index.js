import React from 'react';

import './styles.scss';

const InputBlock = ({ className = '', children }) => {
  return (
    <div className={['input-block', className].join(' ')}>
      {children}
    </div>
  )
}

export default InputBlock;