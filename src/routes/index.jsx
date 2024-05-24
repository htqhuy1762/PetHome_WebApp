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
import SearchItem from '~/pages/SearchItem';
import ShopSubcribe from '~/pages/ShopSubcribe';
import ShopRegister from '~/pages/ShopRegister';
import AddressUser from '~/pages/AddressUser';
import PetTypePage from '~/pages/PetTypePage';
import ItemTypePage from '~/pages/ItemTypePage';

const publicRoutes = [
    { path: '/', component: Pet },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
    { path: '/items', component: Item },
    { path: '/services', component: ServicePet },
    { path: '/blogs', component: Blog },
    { path: '/pets', component: Pet },
    { path: '/pets/:id', component: PetDetail, layout: HeaderFooter },
    { path: '/pets/type/:type', component: PetTypePage, layout: HeaderFooter},
    { path: '/items/:id', component: ItemDetail, layout: HeaderFooter },
    { path: '/items/type/:type', component: ItemTypePage, layout: HeaderFooter},
    { path: '/cart', component: Cart, layout: HeaderFooter },
    { path: '/search/pets/', component: SearchPet, layout: HeaderFooter },
    { path: '/search/items/', component: SearchItem, layout: HeaderFooter },
];

const privateRoutes = [
    { path: '/user/account/profile', component: Profile, layout: UserLayout },
    { path: '/user/shop', component: ShopSubcribe, layout: UserLayout },
    { path: '/user/shop/register', component: ShopRegister, layout: UserLayout },
    { path: '/user/account/address', component: AddressUser, layout: UserLayout },
    { path: '/cart', component: Cart, layout: HeaderFooter },
];

export { publicRoutes, privateRoutes };
