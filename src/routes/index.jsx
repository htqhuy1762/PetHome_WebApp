// Layouts
import { HeaderOnly, FooterOnly } from '~/layouts';

import Login from '~/pages/Login';
import Register from '~/pages/Register';
import Pet from '~/pages/Pet';
import Profile from '~/pages/Profile';
import Blog from '~/pages/Blog';
import Item from '~/pages/Item';
import ServicePet from '~/pages/ServicePet';


const publicRoutes = [
    { path: '/', component: Pet },
    { path: '/login', component: Login, layout: FooterOnly },
    { path: '/register', component: Register, layout: null },
    { path: '/profile', component: Profile, layout: HeaderOnly },
    { path: '/items', component: Item },
    { path: '/services', component: ServicePet },
    { path: '/blogs', component: Blog },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
