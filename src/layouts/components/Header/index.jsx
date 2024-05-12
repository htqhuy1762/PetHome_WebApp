import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import logo from '../../../assets/images/logo.png';
import logotitle from '../../../assets/images/logo-title.png';
import { Input, Badge, Button, Dropdown, Avatar } from 'antd';
import { ShoppingCartOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userServices from '~/services/userServices';
import * as authServices from '~/services/authServices';
import Loading from '~/components/Loading';
import { TabContext } from '~/components/TabProvider/index.jsx';
import { AuthContext } from '~/components/AuthProvider/index.jsx';

const cx = classNames.bind(styles);

function Header({ fixedHeader }) {
    const { currentTab } = useContext(TabContext);
    const { setIsLoggedIn } = useContext(AuthContext);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const onSearch = (value) => {
        if (value.trim() === '') {
            navigate('/');
        } else {
            navigate(`/search/${currentTab}?q=${value}`);
        }

        if (searchRef.current) {
            searchRef.current.blur();
        }
    };
    const [currentUser, setCurrentUser] = useState(null);
    const logout = async () => {
        await authServices.logout();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('expiredAt');
        setIsLoggedIn(false);
        navigate('/login');
    };
    const onChange = (e) => {
        setSearchValue(e.target.value);
    };

    const urlParams = new URLSearchParams(location.search);
    const [searchValue, setSearchValue] = useState(urlParams.get('q') || '');
    const [loading, setLoading] = useState(false);

    const items = [
        {
            key: '1',
            label: <a href="/user/account/profile">Đơn hàng của tôi</a>,
        },
        {
            key: '2',
            label: (
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        logout();
                    }}
                >
                    Đăng xuất
                </a>
            ),
        },
    ];

    const [token, setToken] = useState(localStorage.getItem('accessToken'));

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
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
            } else if (token && new Date().getTime() > new Date(expiredAt).getTime()) {
                // Refresh the token
                const response = await authServices.getNewAccessToken();
                // Save new token and its expiry time to localStorage
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('expiredAt', response.expiredIn);
                setToken(response.data.accessToken);
                getUser();
            }

            setLoading(false);
        };

        getUser();
    }, [token]);

    useEffect(() => {
        // Update the search value when the URL changes
        setSearchValue(urlParams.get('q') || '');
    }, [location.search]);

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
                        ref={searchRef}
                        size="large"
                        placeholder="Tìm thú cưng, vật phẩm, dịch vụ, ..."
                        onSearch={onSearch}
                        enterButton={
                            <Button
                                style={{
                                    color: 'var(--button-color)',
                                    backgroundColor: 'var(--end-color)',
                                    width: '60px',
                                    height: '39px',
                                }}
                                type="primary"
                                icon={<SearchOutlined />}
                            ></Button>
                        }
                        allowClear
                        value={searchValue}
                        onChange={onChange}
                    />
                </div>
                <div className={cx('right-menu')}>
                    {!currentUser ? (
                        <>
                            <Button className={cx('auth-btn')} size="large" onClick={() => navigate('/login')}>
                                Đăng nhập
                            </Button>
                            <Button className={cx('auth-btn')} size="large" onClick={() => navigate('/register')}>
                                Đăng ký
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className={cx('cart')}>
                                <Badge size="small" count={5}>
                                    <Button
                                        style={{ border: 'none', width: '4rem', height: '3rem' }}
                                        className={cx('cart-btn')}
                                        size="large"
                                        type="link"
                                        icon={<ShoppingCartOutlined style={{ fontSize: '4rem', color: 'white' }} />}
                                        onClick={() => navigate('/cart')}
                                    />
                                </Badge>
                            </div>
                            <div className={cx('user')}>
                                <Dropdown menu={{ items }} placement="bottom" arrow>
                                    <a
                                        style={{ color: 'white' }}
                                        className="ant-dropdown-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        {currentUser?.email}
                                        <Avatar
                                            style={{ marginLeft: '0.7rem' }}
                                            size={30}
                                            src={currentUser?.avatar ? currentUser.avatar : null}
                                            icon={!currentUser?.avatar ? <UserOutlined /> : null}
                                        />
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
