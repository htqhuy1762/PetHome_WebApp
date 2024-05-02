import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import logo from '../../../assets/images/logo.png';
import logotitle from '../../../assets/images/logo-title.png';
import { Input, Badge, Button, Dropdown, Menu, Avatar } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userServices from '~/services/userServices';
import * as authServices from '~/services/authServices';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);

function Header({ fixedHeader }) {
    const navigate = useNavigate();
    const onSearch = (value, _e, info) => {};
    const [currentUser, setCurrentUser] = useState(null);
    const logout = async () => {
        await authServices.logout();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('expiredAt');
        navigate('/login');
    };
    const [loading, setLoading] = useState(false);

    const userMenu = (
        <Menu>
            <Menu.Item key={1}>
                <a href="/profile">Đơn hàng của tôi</a>
            </Menu.Item>
            <Menu.Item key={2} onClick={logout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            let token = localStorage.getItem('accessToken');
            const expiredAt = localStorage.getItem('expiredAt');

            // Check if token exists and is not expired
            if (token && new Date().getTime() < new Date(expiredAt).getTime()) {
                try {
                    const response = await userServices.getUser(token);
                    if (response.status === 200) {
                        setCurrentUser(response.data);
                    }
                } catch (error) {
                    // Handle error
                }
            } else if (token && new Date().getTime() > new Date(expiredAt).getTime()){
                // Refresh the token
                const response = await authServices.getNewAccessToken();
                // Save new token and its expiry time to localStorage
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('expiredAt', response.expiredIn);
                token = response.data.accessToken;
            }

            setLoading(false);
        };
        
        getUser();
    }, []);

    if (loading) {
        return <Loading />; // Replace with your loading component or spinner
    }

    return (
        <header className={cx(fixedHeader ? 'wrapperfixed' : 'wrappernonfixed')}>
            <div className={cx('inner')}>
                <a href="/">
                    <div className={cx('logo-wrapper')}>
                        <img className={cx('logo')} src={logo} alt="" />
                        <img className={cx('logo-title')} src={logotitle} alt="" />
                    </div>
                </a>

                <div className={cx('search-container')}>
                    <Input.Search
                        size="large"
                        placeholder="Tìm thú cưng, vật phẩm, dịch vụ, ..."
                        onSearch={onSearch}
                        enterButton
                        allowClear
                    />
                </div>
                <div className={cx('right-menu')}>
                    {!currentUser ? (
                        <>
                            <Button
                                className={cx('auth-btn')}
                                size="large"
                                type="primary"
                                onClick={() => navigate('/login')}
                            >
                                Đăng nhập
                            </Button>
                            <Button size="large" type="primary" onClick={() => navigate('/register')}>
                                Đăng ký
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className={cx('cart')}>
                                <Badge count={5}>
                                    <Button
                                        style={{ border: 'none', width: '5rem', height: '4rem' }}
                                        className={cx('cart-btn')}
                                        size="large"
                                        type="text"
                                        icon={<ShoppingCartOutlined style={{ fontSize: '4rem', color: 'white' }} />}
                                    />
                                </Badge>
                            </div>
                            <div className={cx('user')}>
                                <Dropdown overlay={userMenu} placement="bottom" arrow>
                                    <a
                                        style={{ color: 'white' }}
                                        className="ant-dropdown-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        {currentUser?.email}
                                        <Avatar style={{ marginLeft: '0.7rem' }} size={30} icon={<UserOutlined />} />
                                    </a>
                                </Dropdown>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
