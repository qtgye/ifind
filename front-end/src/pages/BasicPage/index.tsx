import { useEffect, useState } from 'react';

import { PageContextProvider } from '@contexts/pageContext';
import BasicPageTemplate from '@templates/BasicPage';
import { usePageData } from '@contexts/pageContext';
import { withComponentName } from '@utilities/component';

const BasicPage = () => {
    const { data, loading } = usePageData();
    const [ pageData, setPageData ] = useState<ComponentEntryFieldsPageFields>();

    useEffect(() => {
        if ( data && data.data ) {
            setPageData(data.data);
        }
    }, [ data ]);

    return (
        <BasicPageTemplate title={ pageData?.title || '' }>
            <div dangerouslySetInnerHTML={{ __html: loading ? 'Loading Page...' : pageData?.body || ''  }}></div>
        </BasicPageTemplate>
    )
};

const WrappedBasicPage = (props: any) => (
  <PageContextProvider>
    <BasicPage {...props} />
  </PageContextProvider>
)

export default withComponentName('BasicPage')(WrappedBasicPage);
