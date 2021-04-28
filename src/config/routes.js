import Home from '@pages/Home';
import ProductComparison from '@pages/ProductComparison';
import Findtube from '@pages/Findtube';
import Blog from '@pages/Blog';
import Contact from '@pages/Contact';
import AGB from '@pages/AGB';
import Impressum from '@pages/Impressum';
import DataProtection from '@pages/DataProtection';
import AboutUs from '@pages/AboutUs';

const routes =  [

    /**
     * Routes visible in Header Navigation
     */
    {
        path: '/',
        component: Home,
        label: 'Home',
        withSideNav: true,
        exact: true,
        noUserHeart: true, // TODO: Verify Implementation
    },
    {
        path: '/productcomparison',
        component: ProductComparison,
        label: 'Product Comparison',
    },
    {   
        path: '/findtube', 
        component: Findtube,
        label: 'Findtube',
    },
    {   
        path: '/blog', 
        component: Blog,
        label: 'Blog',
    },
    {   
        path: '/contact', 
        component: Contact,
        label: 'Contact',
    },

    /**
     * Routes visible in the Footer
     */
     {   
        path: '/about-us',
        component: AboutUs,
        label: 'About Us',
    },
    {   
        path: '/agb',
        component: AGB,
        label: 'AGB',
    },
    {   
        path: '/impressum',
        component: Impressum,
        label: 'Impressum',
    },
    {   
        path: '/data-protection',
        component: DataProtection,
        label: 'Data Protection',
    },
    // {path: 'agb', component: AGBComponent},
    // {path: 'data-protection', component: DataProtectionComponent},
    // {path: '', component: HomeComponent},
    // {path: 'impressum', component: ImpressumComponent},
    // {path: 'blog', component: BlogComponent},
    // {path: 'contact', component: ContactComponent},
];

export const navigationRoutes = [ '/', '/productcomparison', '/findtube', '/blog', '/contact' ];
export const footerRoutes = [ '/about-us', '/agb', '/impressum', '/data-protection' ];
export default routes;