// Layouts
import { HeaderFooter, FooterOnly } from '~/layouts';

import Login from '~/pages/Login';
import Register from '~/pages/Register';
import Pet from '~/pages/Pet';
import Profile from '~/pages/Profile';
import Blog from '~/pages/Blog';
import Item from '~/pages/Item';
import ServicePet from '~/pages/ServicePet';
import PetDetail from '~/pages/PetDetail';

const publicRoutes = [
    { path: '/', component: Pet },
    { path: '/login', component: Login, layout: FooterOnly },
    { path: '/register', component: Register, layout: null },
    { path: '/profile', component: Profile, layout: HeaderFooter },
    { path: '/items', component: Item },
    { path: '/services', component: ServicePet },
    { path: '/blogs', component: Blog },
    { path: '/pets', component: Pet },
    { path: '/pets/:id', component: PetDetail },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
