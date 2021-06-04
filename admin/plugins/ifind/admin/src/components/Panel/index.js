import React from 'react';

import './styles.scss';

const Panel = ({ children, className = '' }) => {
  return (
    <div className={['panel', className].join(' ')}>
      {children}
    </div>
  )
};

export default Panel;