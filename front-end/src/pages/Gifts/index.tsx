import BasicPage from '@templates/BasicPage';
import { withComponentName } from '@utilities/component';

const Gifts = () => (
    <BasicPage title="Gifts">
        Gifts works!
    </BasicPage>
);

export default withComponentName('GiftsPage')(Gifts);