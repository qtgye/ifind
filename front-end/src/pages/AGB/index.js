import BasicPage from '@templates/BasicPage';
import content from '@mocks/pages/agb';

const AGB = () => (
    <BasicPage title='AGB'>
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
    </BasicPage>
);

export default AGB;