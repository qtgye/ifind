import React from 'react';
import { _items, createItem } from '../../mocks/components/carouselitems';

import './carousel2.scss';

const CarouselSlideItem = ({ pos, idx, activeIdx }) => {

    const item = createItem(pos, idx, activeIdx);

    return (
        <li className="carousel__slide-item" style={item.styles}>
            <div className="carousel__slide-item-img-link">
                <button>Test</button>
            </div>
            {/* <div className="carousel-slide-item__body">
                <h4>{item.player.title}</h4>
                <p>{item.player.desc}</p>
            </div> */}
        </li>
    );
};

export default CarouselSlideItem;
