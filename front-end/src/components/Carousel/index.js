import React, { useEffect, useState } from 'react';
import { useCategoryTree } from '@contexts/categoriesContext';
import IfindIcon from '@components/IfindIcon';
import { find } from 'lodash';
import { useLocation } from 'react-router-dom';
import routes from '@config/routes';
import { _items, length, keys, sleep } from '../../mocks/components/carouselitems';
import CarouselSlideItem from './CarouselSlideItem';

import './carousel2.scss';

const Carousel = () => {

    const categoryTree = useCategoryTree();
    const { pathname } = useLocation();
    const currentRouteConfig = find(routes, ({ path }) => pathname === path);

    // const [current, setCurrent] = useState(0);
    // const length = categoryTree.length;

    // const nextSlide = () => {
    //     setCurrent(current === length - 1 ? 0 : current + 1);
    //     console.log(length, current);
    // };

    // const prevSlide = () => {
    //     setCurrent(current === 0 ? length - 1 : current - 1);
    //     console.log(length, current);
    // };

    /* <div>
        <button className="left-arrow" onClick={prevSlide}>Prev</button>
        <button className="right-arrow" onClick={nextSlide}>Next</button>
    </div> */

    const [items, setItems] = useState(keys);
    const [isTicking, setIsTicking] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const bigLength = items.length;

    const prevClick = (jump = 1) => {
        if (!isTicking) {
            setIsTicking(true);
            setItems((prev) => {
                return prev.map((_, i) => prev[(i + jump) % bigLength]);
            });
        }
    };

    const nextClick = (jump = 1) => {
        if (!isTicking) {
            setIsTicking(true);
            setItems((prev) => {
                return prev.map(
                    (_, i) => prev[(i - jump + bigLength) % bigLength],
                );
            });
        }
    };

    const handleDotClick = (idx) => {
        if (idx < activeIdx) prevClick(activeIdx - idx);
        if (idx > activeIdx) nextClick(idx - activeIdx);
    };

    useEffect(() => {
        if (isTicking) sleep(300).then(() => setIsTicking(false));
    }, [isTicking]);

    useEffect(() => {
        setActiveIdx((length - (items[0] % length)) % length) // prettier-ignore
    }, [items]);



    return (
        <>
            {/* {currentRouteConfig.path === "/" || currentRouteConfig.path === "/contact" ? "" :
                <div className="carousel">

                    {categoryTree.map((category, index) => {
                        return (
                            <div className="items" key={index}>
                                <button>
                                    <IfindIcon icon={category.icon} className="carousel-icon" />
                                    <span>{(category.label.label).split(" ")[0]}</span>
                                </button>
                            </div>
                        )
                    })}
                </div>
            } */}
            <div className="carousel__wrap">
                <div className="carousel__inner">
                    <button className="carousel__btn carousel__btn--prev" onClick={() => prevClick()}>
                        <i className="carousel__btn-arrow carousel__btn-arrow--left" />
                    </button>
                    <div className="carousel__container">
                        <ul className="carousel__slide-list">
                            {items.map((pos, i) => (
                                <CarouselSlideItem
                                    key={i}
                                    idx={i}
                                    pos={pos}
                                    activeIdx={activeIdx}
                                />
                            ))}
                        </ul>
                    </div>
                    <button className="carousel__btn carousel__btn--next" onClick={() => nextClick()}>
                        <i className="carousel__btn-arrow carousel__btn-arrow--right" />
                    </button>
                    <div className="carousel__dots">
                        {items.slice(0, length).map((pos, i) => (
                            <button
                                key={i}
                                onClick={() => handleDotClick(i)}
                                className={i === activeIdx ? 'dot active' : 'dot'}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
export default Carousel;
