import React from 'react';
import {
    CarouselProvider, Slider, Slide,
    ButtonBack, ButtonNext,
    ImageWithZoom
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import './homecarousel.scss';

const homecarousel = () => {
    return (
        <>
            <div className="home-carousel">
                <CarouselProvider
                    visibleSlides={1}
                    totalSlides={3}
                    step={1}
                    naturalSlideWidth={500}
                    naturalSlideHeight={300}
                    hasMasterSpinner
                    infinite
                    isPlaying
                    touchEnabled
                >
                    <div className="title-container">
                        <h4 className="title">TRENDING AND POPULAR PRODUCTS</h4>
                    </div>

                    <div className="hcarousel-container">
                        <Slider className="slider">
                            <Slide index={0}>
                                <ImageWithZoom src="/banner1.jpg" />
                            </Slide>
                            <Slide index={1}>
                                <ImageWithZoom src="/banner2.jpg" />
                            </Slide>
                            <Slide index={2}>
                                <ImageWithZoom src="/banner3.jpg" />
                            </Slide>
                        </Slider>
                        <ButtonBack className="buttonBack"><i className="fa fa-caret-left"></i></ButtonBack>
                        <ButtonNext className="buttonNext"><i className="fa fa-caret-right"></i></ButtonNext>
                    </div>
                </CarouselProvider>
            </div>
        </>
    )
}

export default homecarousel;