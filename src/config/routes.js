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
        path: '/productcomparison',
        component: ProductComparison,
        label: 'Product Comparison',
        showInNav: true,
    },
    {   
        path: '/findtube', 
        component: Findtube,
        label: 'Findtube',
        showInNav: true,
    },
    {   
        path: '/blog', 
        component: Blog,
        label: 'Blog',
        showInNav: true,
    },
    {   
        path: '/contact', 
        component: Contact,
        label: 'Contact',
        showInNav: true,
    },

    /**
     * Routes visible in the Footer
     */
     {   
        path: '/about-us', 
        component: AboutUs,
        label: 'About Us',
        showInFooter: true,
    },
    {   
        path: '/agb', 
        component: AGB,
        label: 'AGB',
        showInFooter: true,
    },
    {   
        path: '/impressum', 
        component: Impressum,
        label: 'Impressum',
        showInFooter: true,
    },
    {   
        path: '/data-protection', 
        component: DataProtection,
        label: 'Data Protection',
        showInFooter: true,
    },
    // {path: 'agb', component: AGBComponent},
    // {path: 'data-protection', component: DataProtectionComponent},
    // {path: '', component: HomeComponent},
    // {path: 'impressum', component: ImpressumComponent},
    // {path: 'blog', component: BlogComponent},
    // {path: 'contact', component: ContactComponent},
    {
        path: '/',
        component: Home,
        label: 'Home',
        showInNav: true,
        withSideNav: true,
    },
];

export default routes;