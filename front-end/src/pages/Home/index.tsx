//import { useEffect, useRef } from "react";
import VideoPlayer from "@components/VideoPlayer";
import GeneralTemplate from "@templates/GeneralTemplate";
import { withComponentName } from '@utilities/component';
import Carousel from '../../components/HomeCarousel';
import "./home.scss";

const Home = () => {

  return (
    <GeneralTemplate>
      <div className="home">
        <div className="container">
          <div className="top">
            <div className="top-container">
              <h1>WILLKOMMEN BEI IFINDILU</h1>
              <div className="top-content">
                <p>iFINDilu ist eine Shopping- und Vergleichsplattform, die die Vision verfolgt, für dich den Suchprozess so angenehm wie möglich zu gestalten. Weitere Informationen findest du hier.</p>          
                <button>KLICKE HIER</button>
              </div>
            </div>
            <div className="top-carousel">
              <div className="top-carousel-content">
                <Carousel />
              </div>
            </div>
          </div>
          <div className="video">
            <div className="video-content">
              <VideoPlayer />
            </div>
          </div>
          <div className="offers">
            <div className="offers-banner">
              <img src="/offers-banner.jpg" height={350} width={600} alt="banner_offers" />
            </div>
            <div className="offers-container">
              <div className="offers-content">
                <div className="offers-text">
                  <p>Finde die neusten Angebote von Amazon, Ebay, Aliexpress und Co, auch für dich ist hier etwas dabei.</p>   
                </div>
                <button>KLICKE HIER</button>
              </div>
            </div>
          </div>
          <div className="prodcomp">
            <div className="prodcomp-container">
              <div className="prodcomp-text">
                <p>Wir machen uns für dich die Mühe, nach Produkten zu suchen, wie es ein Experte tun würde, dafür nutzen wir unseren speziellen Suchprozess. Interresse?</p>
              </div>
              <button>KLICKE HIER</button>
            </div>
            <div className="prodcomp-banner">
              <img src="/banner2.jpg" height={350} width={600} alt="banner_product_comparison" />
            </div>
          </div>
          <div className="gifts">
            <div className="gifts-banner">
              <img src="/gifts-banner.jpg" height={350} width={600} alt="banner_gifts" />
            </div>
            <div className="gifts-container">
              <div className="gifts-content">
                <div className="gifts-text">
                  <p>Brauchst du Geschenke für einen Geburtstag, Weihnachten oder möchtest du deinen Partner eine Freude machen, Ideen hierzu findest du hier.</p>
                </div>
                <button>KLICKE HIER</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeneralTemplate>
  );
};

export default withComponentName('HomePage')(Home);;

