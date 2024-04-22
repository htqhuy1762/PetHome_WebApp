// Layouts
import { HeaderOnly, FooterOnly } from '~/layouts';

import Login from '~/pages/Login';
import Register from '~/pages/Register';
import Home from '~/pages/Home';
import Profile from '~/pages/Profile';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/login', component: Login, layout: FooterOnly },
    { path: '/register', component: Register, layout: null },
    { path: '/profile', component: Profile, layout: HeaderOnly },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
