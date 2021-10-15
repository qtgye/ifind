import { useState, useEffect } from 'react';
import GeneralTemplate from '@templates/GeneralTemplate';
import { withComponentName, withProvider } from '@utilities/component';
import { useHomepageData } from '@contexts/homepageContext';

import NaturalList from '@components/NaturalList';

const Home = () => {
    const { homepageData, loading } = useHomepageData();
    const [isLoading, setIsLoading] = useState(true);
    const icon = '/images/loading.png';

    const [items, setItems] = useState([]);

    useEffect(() => {
        if (homepageData) {
            const { bestSellers } = homepageData;
            setItems(bestSellers);
            setIsLoading(false);
        }
    }, [homepageData])

    return (
        <GeneralTemplate>
            <div className="home">
                <div className="container" style={{ paddingLeft: '280px' }}>
                    {loading && <span className="loading"><img src={icon} className="loading-icon" alt="icon" /></span>}
                    {!loading &&
                        <NaturalList
                            loading={isLoading}
                            items={items}
                        />
                    }
                </div>
            </div>
        </GeneralTemplate>
    )
};

export default withProvider('HomepageContextProvider')(withComponentName('HomePage')(Home));