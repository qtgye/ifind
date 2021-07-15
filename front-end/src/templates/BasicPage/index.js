import { useEffect } from 'react';
import Footer from '@components/Footer';
import NewsLetter from '@components/NewsLetter';

const BasicPage = ({ title, children }) => {

    // Scroll to top of page on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <section className="shop-home-list section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-12">
                            <div className="row">
                                <div className="col-12">

                                    <div className="shop-section-title" id="1">
                                        <br />
                                        <br />
                                        <h1>{title}</h1>
                                    </div>


                                </div>

                                <div className="content">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <NewsLetter />
            <Footer />
        </>
    )
};

export default BasicPage;