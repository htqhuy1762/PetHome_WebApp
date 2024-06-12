// Layouts
import { HeaderFooter, UserLayout, ShopManagementLayout } from '~/layouts';

import Login from '~/pages/AuthPage/Login';
import Register from '~/pages/AuthPage/Register';
import Pet from '~/pages/PetPage/Pet';
import Profile from '~/pages/UserPage/Profile';
import Blog from '~/pages/BlogPage/Blog';
import Item from '~/pages/ItemPage/Item';
import ServicePet from '~/pages/ServicePage/ServicePet';
import PetDetail from '~/pages/PetPage/PetDetail';
import ItemDetail from '~/pages/ItemPage/ItemDetail';
import Cart from '~/pages/CartPage/Cart';
import SearchPet from '~/pages/PetPage/SearchPet';
import SearchItem from '~/pages/ItemPage/SearchItem';
import ShopSubcribe from '~/pages/ShopPage/ShopSubcribe';
import ShopRegister from '~/pages/ShopPage/ShopRegister';
import AddressUser from '~/pages/UserPage/AddressUser';
import PetTypePage from '~/pages/PetPage/PetTypePage';
import ItemTypePage from '~/pages/ItemPage/ItemTypePage';
import ResetPass from '~/pages/UserPage/ResetPass';
import CompletedRegisterShop from '~/pages/ShopPage/CompletedRegisterShop';
import ShopManagement from '~/pages/ShopPage/ShopManagement';
import MyShop from '~/pages/UserPage/MyShop';
import MyBlog from '~/pages/BlogPage/MyBlog';
import ServiceDetail from '~/pages/ServicePage/ServiceDetail';
import Purchase from '~/pages/UserPage/Purchase';
import ManagementPet from '~/pages/ShopPage/ManagementPet';

const publicRoutes = [
    { path: '/', component: Pet },
    { path: '/login', component: Login, layout: null },
    { path: '/register', component: Register, layout: null },
    { path: '/items', component: Item },
    { path: '/services', component: ServicePet },
    { path: '/services/:id', component: ServiceDetail, layout: HeaderFooter },
    { path: '/blogs', component: Blog },
    { path: '/blogs/myblog', component: MyBlog },
    { path: '/pets', component: Pet },
    { path: '/pets/:id', component: PetDetail, layout: HeaderFooter },
    { path: '/pets/type/:type', component: PetTypePage, layout: HeaderFooter },
    { path: '/items/:id', component: ItemDetail, layout: HeaderFooter },
    { path: '/items/type/:type', component: ItemTypePage, layout: HeaderFooter },
    { path: '/search/pets/', component: SearchPet, layout: HeaderFooter },
    { path: '/search/items/', component: SearchItem, layout: HeaderFooter },
];

const privateRoutes = [
    { path: '/user/account/profile', component: Profile, layout: UserLayout },
    { path: '/user/shop', component: MyShop, layout: UserLayout },
    { path: '/user/shop/subcribe', component: ShopSubcribe, layout: UserLayout},
    { path: '/user/shop/register', component: ShopRegister, layout: UserLayout },
    { path: '/user/shop/complete', component: CompletedRegisterShop, layout: UserLayout},
    { path: '/user/shop/management', component: ShopManagement, layout: ShopManagementLayout},
    { path: '/user/shop/management/pet', component: ManagementPet, layout: ShopManagementLayout},
    { path: '/user/account/address', component: AddressUser, layout: UserLayout },
    { path: '/user/account/changepass', component: ResetPass, layout: UserLayout },
    { path: '/cart', component: Cart, layout: HeaderFooter },
    { path: '/user/purchase', component: Purchase, layout: UserLayout },
];

export { publicRoutes, privateRoutes };
