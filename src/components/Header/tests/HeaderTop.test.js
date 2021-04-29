import React from 'react';
import ReactDOM from 'react-dom';
import HeaderTop from '../HeaderTop';

describe('HeaderTop Component', () => {
  it('Renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<HeaderTop />, div);
  });
});
