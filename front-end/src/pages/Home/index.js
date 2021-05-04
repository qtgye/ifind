import GeneralTemplate from '@templates/GeneralTemplate';
import HeroSlider from '@components/HeroSlider';
import { withComponentName } from '@utilities/component';

const Home = () => {
    return (
        <GeneralTemplate>
            <div className="home">
                <HeroSlider />
            </div>
        </GeneralTemplate>
    )
};

export default withComponentName('HomePage')(Home);