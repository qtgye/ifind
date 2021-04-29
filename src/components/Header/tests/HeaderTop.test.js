import { render, screen } from '@testing-library/react'
import HeaderTop from '../HeaderTop';

describe('HeaderTop Component', () => {
  it('Renders without crashing', () => {
    render(<HeaderTop />);
    
    const element = document.querySelector('.header-top');
    
    expect(element).not.toBe(null);
  });
});
