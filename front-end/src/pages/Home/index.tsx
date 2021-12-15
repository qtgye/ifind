import { useEffect } from 'react';
import VideoPlayer from "@components/VideoPlayer";
import GeneralTemplate from '@templates/GeneralTemplate';
import { withComponentName } from '@utilities/component';
import Carousel from '../../components/HomeCarousel';
import { useLanguages } from "@contexts/languagesContext";
import Aos from "aos";
import "aos/dist/aos.css";

import "./home.scss";

const Home = () => {

  const { userLanguage = "en" } = useLanguages();

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, [])

  return (
    <GeneralTemplate>
      <div className="home">
        <div className="container">
          <div data-aos='fade-in' className="top">
            <div className="top-container">
              <h1>WILLKOMMEN BEI IFINDILU</h1>
              <div className="top-content">
                <div className="top-text">
                  <p>iFINDilu ist eine Shopping- und Vergleichsplattform, die die Vision verfolgt, für dich den Suchprozess so angenehm wie möglich zu gestalten. Weitere Informationen findest du hier.</p>
                </div>
              </div>
              <a href={"/" + userLanguage + "/about-us"}>
                <button className="home-btn">
                  KLICKE HIER
                </button>
              </a>
            </div>
            <div className="top-carousel">
              <div className="top-carousel-content">
                <Carousel />
              </div>
            </div>
          </div>
          <div data-aos="zoom-in" className="video">
            <div className="video-content">
              <VideoPlayer />
            </div>
          </div>
          <div data-aos="fade-right" className="offers">
            <div className="offers-banner">
              <a href={"/" + userLanguage + "/offers"}>
                <img src="/offers-banner.jpg" height={350} width={600} alt="banner_offers" />
              </a>
            </div>
            <div className="offers-container">
              <div className="offers-content">
                <div className="offers-text">
                  <p>Finde die neusten Angebote von Amazon, Ebay, Aliexpress und Co, auch für dich ist hier etwas dabei.</p>
                </div>
                <a href={"/" + userLanguage + "/offers"}>
                  <button>KLICKE HIER</button>
                </a>
              </div>
            </div>
          </div>
          <div data-aos="fade-left" className="prodcomp">
            <div className="prodcomp-container">
              <div className="prodcomp-text">
                <p>Wir machen uns für dich die Mühe, nach Produkten zu suchen, wie es ein Experte tun würde, dafür nutzen wir unseren speziellen Suchprozess. Interresse?</p>
              </div>
              <a href={"/" + userLanguage + "/productcomparison"}>
                <button>KLICKE HIER</button>
              </a>
            </div>
            <div className="prodcomp-banner">
              <a href={"/" + userLanguage + "/productcomparison"}>
                <img src="/prodcomp-banner.jpg" height={350} width={500} alt="banner_product_comparison" />
              </a>
            </div>
          </div>
          <div data-aos="fade-right" className="gifts">
            <div className="gifts-banner">
              <a href={"/" + userLanguage + "/gifts"}>
                <img src="/gifts-banner-3.jpg" height={350} width={600} alt="banner_gifts" />
              </a>
            </div>
            <div className="gifts-container">
              <div className="gifts-content">
                <div className="gifts-text">
                  <p>Brauchst du Geschenke für einen Geburtstag, Weihnachten oder möchtest du deinen Partner eine Freude machen, Ideen hierzu findest du hier.</p>
                </div>
                <a href={"/" + userLanguage + "/gifts"}>
                  <button>KLICKE HIER</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeneralTemplate>
  );
};

export default withComponentName('HomePage')(Home);

