// Layouts
import { HeaderFooter, UserLayout } from '~/layouts';

import Login from '~/pages/Login';
import Register from '~/pages/Register';
import Pet from '~/pages/Pet';
import Profile from '~/pages/Profile';
import Blog from '~/pages/Blog';
import Item from '~/pages/Item';
import ServicePet from '~/pages/ServicePet';
import PetDetail from '~/pages/PetDetail';
import ItemDetail from '~/pages/ItemDetail';
import Cart from '~/pages/Cart';
import SearchPet from '~/pages/SearchPet';

const publicRoutes = [
    { path: '/', component: Pet },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
    { path: '/items', component: Item },
    { path: '/services', component: ServicePet },
    { path: '/blogs', component: Blog },
    { path: '/pets', component: Pet },
    { path: '/pets/:id', component: PetDetail, layout: HeaderFooter },
    { path: '/items/:id', component: ItemDetail, layout: HeaderFooter },
    { path: '/cart', component: Cart, layout: HeaderFooter },
    { path: '/search/pets/', component: SearchPet, layout: HeaderFooter },
];

const privateRoutes = [{ path: '/user/account/profile', component: Profile, layout: UserLayout }];

export { publicRoutes, privateRoutes };
