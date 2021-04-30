import content from '@mocks/pages/data-protection';
import BasicPage from '@templates/BasicPage';

const DataProtection = () => {
    return (
        <BasicPage title='Datenschutzerklärung'>
            <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </BasicPage>
    )
};

export default DataProtection;