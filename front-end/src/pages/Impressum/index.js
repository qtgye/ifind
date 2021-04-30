import content from '@mocks/pages/impressum';
import BasicPage from '@templates/BasicPage';

const Impressum = () => {
    return (
        <BasicPage title='Impressum'>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </BasicPage>
    )
};

export default Impressum;