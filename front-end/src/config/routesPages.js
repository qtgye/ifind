import Home from '@pages/Home';
import ProductComparison from '@pages/ProductComparison';
import Findtube from '@pages/Findtube';
import Blog from '@pages/Blog';
import Contact from '@pages/Contact';
import AGB from '@pages/AGB';
import Impressum from '@pages/Impressum';
import DataProtection from '@pages/DataProtection';
import AboutUs from '@pages/AboutUs';

import routes from './routes';

export const pages = [
    Home,
    ProductComparison,
    Findtube,
    Blog,
    Contact,
    AGB,
    Impressum,
    DataProtection,
    AboutUs,
];

export default routes.map(route => ({
    ...route,
    component: pages.find(page => page.componentName === route.componentName),
}))