import Home from '@pages/Home';
import ProductComparison from '@pages/ProductComparison';
import Findtube from '@pages/Findtube';
import Blog from '@pages/Blog';
import Contact from '@pages/Contact';

const routes =  [
    {
        path: '/productcomparison',
        component: ProductComparison,
    },
    {   
        path: '/findtube', 
        component: Findtube
    },
    {   
        path: '/blog', 
        component: Blog
    },
    {   
        path: '/contact', 
        component: Contact
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
        withSideNav: true,
    },
];

export default routes;