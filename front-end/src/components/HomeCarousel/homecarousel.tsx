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
                    totalSlides={5}
                    step={1}
                    naturalSlideWidth={600}
                    naturalSlideHeight={400}
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
                                <ImageWithZoom src="/offers-banner.jpg" />
                            </Slide>
                            <Slide index={1}>
                                <ImageWithZoom src="/gifts-banner.jpg" />
                            </Slide>
                            <Slide index={2}>
                                <ImageWithZoom src="/banner1.jpg" />
                            </Slide>
                            <Slide index={3}>
                                <ImageWithZoom src="/banner2.jpg" />
                            </Slide>
                            <Slide index={4}>
                                <ImageWithZoom src="/banner3.jpg" />
                            </Slide>
                        </Slider>
                        <ButtonBack className="buttonBack"><i className="fa fa-angle-left"></i></ButtonBack>
                        <ButtonNext className="buttonNext"><i className="fa fa-angle-right"></i></ButtonNext>
                    </div>
                </CarouselProvider>
            </div>
        </>
    )
}

export default homecarousel;