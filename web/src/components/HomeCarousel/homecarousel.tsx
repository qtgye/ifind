import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useGlobalData } from "providers/globalDataContext";

const Homecarousel = () => {
  const { userLanguage = "en" } = useGlobalData();

  return (
    <>
      <Carousel
        className="Scontainer"
        infiniteLoop
        autoPlay
        showThumbs={false}
        showStatus={false}
        centerMode
        centerSlidePercentage={90}
      >
        <a href={"/" + userLanguage + "/offers"}>
          <div>
            <img
              src="/offers-banner.jpg"
              height="250px"
              width="300px"
              alt="carousel-image1"
            />
          </div>
        </a>
        <a href={"/" + userLanguage + "/productcomparison"}>
          <div>
            <img
              src="/prodcomp-banner.jpg"
              height="250px"
              width="300px"
              alt="carousel-image2"
            />
          </div>
        </a>
        <a href={"/" + userLanguage + "/gifts"}>
          <div>
            <img
              src="/gifts-banner-3.jpg"
              height="250px"
              width="300px"
              alt="carousel-image3"
            />
          </div>
        </a>
        <div>
          <img
            src="/banner2.jpg"
            height="250px"
            width="300px"
            alt="carousel-image4"
          />
        </div>
        <div>
          <img
            src="/banner3.jpg"
            height="250px"
            width="=300px"
            alt="carousel-image5"
          />
        </div>
      </Carousel>
    </>
  );
};

export default Homecarousel;
