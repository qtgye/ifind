const routes: RouteConfig[] = [

    /**
     * Routes visible in Header Navigation
     */
    {
        path: '/',
        componentName: 'HomePage',
        label: 'Home',
        withSideNav: true,
        exact: true,
        // noUserHeart: true, // TODO: Verify Implementation
    },
    {
        path: '/offers',
        componentName: 'OffersPage',
        label: 'Offers',
        withSideNav: true,
        exact: true,
    },
    {
        path: '/productcomparison',
        componentName: 'ProductComparisonPage',
        label: 'Product Comparison',
        withSideNav: true,
        exact: true,
    },
    {
        path: '/gifts',
        componentName: 'GiftsPage',
        label: 'Gifts',
        withSideNav: true,
        exact: true,
    },
    // {
    //     path: '/findtube',
    //     componentName: 'FindTubePage',
    //     label: 'Findtube',
    // },
    // {
    //     path: '/blog',
    //     componentName: 'BlogPage',
    //     label: 'Blog',
    // },
    {
        path: '/contact',
        componentName: 'ContactPage',
        label: 'Contact',
        withSideNav: true,
        exact: true,
    },

    /**
     * Routes visible in the Footer
     * Temporary Static Pages
     */
    // {
    //     path: '/about-us',
    //     componentName: 'AboutUsPage',
    //     label: 'About Us',
    // },
    // {
    //     path: '/agb',
    //     componentName: 'AGBPage',
    //     label: 'AGB',
    // },
    // {
    //     path: '/impressum',
    //     componentName: 'ImpressumPage',
    //     label: 'Impressum',
    // },
    // {
    //     path: '/data-protection',
    //     componentName: 'DataProtectionPage',
    //     label: 'Data Protection',
    // },
];

/**
 * Dynamic Routes
 */
export const dynamicRoutes: RouteConfig[] = [
    {
        path: '/:slug',
        componentName: 'BasicPage',
    },
];


export const navigationRoutes: string[] = ['/', '/offers', '/productcomparison', '/gifts', '/contact'];
export const footerRoutes: string[] = [
    // '/about-us',
    // '/agb',
    // '/impressum',
    // '/data-protection'
];

export default routes;
