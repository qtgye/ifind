import React, { useEffect } from 'react';
import Layout from 'templates/Layout';

const GeneralTemplate = ({ children }: React.PropsWithChildren<any>) => {

    // Scroll to top of page on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
      <Layout>
        {children}
      </Layout>
    )
};

export default GeneralTemplate;
