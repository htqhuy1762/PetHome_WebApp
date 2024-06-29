import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import logo from '~/assets/images/logo.png';
import logotitle from '~/assets/images/logo-title.png';
import { Input, Button, Avatar, Select, List, Dropdown } from 'antd';
import { ShoppingCartOutlined, UserOutlined, SearchOutlined, BellOutlined, ReloadOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userServices from '~/services/userServices';
import * as authServices from '~/services/authServices';
import * as notificationServices from '~/services/notificationServices';
import Loading from '~/components/Loading';
import { AuthContext } from '~/context/AuthProvider/index.jsx';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const cx = classNames.bind(styles);

function Header({ fixedHeader }) {
    const [selectValue, setSelectValue] = useState(localStorage.getItem('selectValue') || 'pets');
    const handleSelectChange = (value) => {
        setSelectValue(value);
        localStorage.setItem('selectValue', value);
    };
    const { setIsLoggedIn } = useContext(AuthContext);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const { Option } = Select;
    const onSearch = (value) => {
        if (value.trim() === '') {
            navigate('/');
        } else {
            navigate(`/search/${selectValue}?q=${value}`);
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
        localStorage.removeItem('selectValue');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('idShop');
        setIsLoggedIn(false);
        navigate('/login');
    };
    const onChange = (e) => {
        setSearchValue(e.target.value);
    };

    const urlParams = new URLSearchParams(location.search);
    const [searchValue, setSearchValue] = useState(urlParams.get('q') || '');
    const [loading, setLoading] = useState(true);

    const items = [
        {
            key: '1',
            label: <a href="/user/account/profile">Hồ sơ của tôi</a>,
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

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            try {
                const response = await userServices.getUser();
                if (response.status === 200) {
                    setCurrentUser(response.data);
                }
            } catch (error) {
                // Handle error
            }
            setLoading(false);
        };

        getUser();
    }, []);

    useEffect(() => {
        setSearchValue(urlParams.get('q') || '');
    }, [location.search]);

    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const getNotifications = async () => {
        try {
            const response = await notificationServices.getNotification();
            if (response.status === 200) {
                setNotifications(response.data || []);
            }
        } catch (error) {
            // Handle error
        }
    };

    useEffect(() => {
        getNotifications();
    }, []);

    const handleBellClick = () => {
        setNotificationVisible(!notificationVisible);
    };

    const closeNotification = () => {
        setNotificationVisible(false);
    };

    const reloadNotifications = () => {
        getNotifications();
    };

    const markAsRead = async (id) => {
        try {
            const notification = notifications.find((noti) => noti.id_noti === id);
            if (notification.is_read) {
                return;
            }

            const response = await notificationServices.updateReadNotification(id);
            const response2 = await notificationServices.updateShowNotification(id);
            if (response.status === 200 && response2.status === 200) {
                setNotifications((prevNotifications) =>
                    prevNotifications.map((noti) =>
                        noti.id_noti === id ? { ...noti, is_read: true, is_showed: true } : noti,
                    ),
                );
            }
        } catch (error) {
            // Handle error
        }
    };

    if (loading) {
        return <Loading />;
    }

    console.log(notifications);

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
                        addonBefore={
                            <Select
                                style={{
                                    backgroundColor: '#e6e6e6',
                                    width: '105px',
                                    height: '39.6px',
                                    borderRadius: '8px',
                                }}
                                value={selectValue}
                                onChange={handleSelectChange}
                            >
                                <Option value="pets">Thú cưng</Option>
                                <Option value="items">Vật phẩm</Option>
                            </Select>
                        }
                        size="large"
                        placeholder="Tìm kiếm"
                        onSearch={onSearch}
                        enterButton={
                            <Button
                                style={{
                                    color: 'var(--button-next-color)',
                                    backgroundColor: 'var(--end-color)',
                                    width: '65px',
                                    height: '39.6px',
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
                                <Button
                                    style={{ border: 'none', width: '4rem', height: '3rem' }}
                                    className={cx('cart-btn')}
                                    size="medium"
                                    type="text"
                                    shape="circle"
                                    icon={<ShoppingCartOutlined style={{ fontSize: '3.5rem', color: 'white' }} />}
                                    onClick={() => navigate('/cart')}
                                />
                            </div>
                            <div className={cx('notification')}>
                                <Button
                                    style={{ border: 'none', width: '4rem', height: '3rem' }}
                                    className={cx('cart-btn')}
                                    size="medium"
                                    type="text"
                                    shape="circle"
                                    icon={<BellOutlined style={{ fontSize: '3.1rem', color: 'white' }} />}
                                    onClick={handleBellClick}
                                />
                                {notificationVisible && (
                                    <>
                                        <div className={cx('arrow')}></div>
                                        <div className={cx('notification-container')}>
                                            <div className={cx('noti-header')}>
                                                <span>Thông báo</span>
                                                <Button
                                                    type="text"
                                                    icon={<ReloadOutlined />}
                                                    className={cx('noti-reload')}
                                                    onClick={reloadNotifications}
                                                />
                                            </div>
                                            <List
                                                dataSource={notifications}
                                                renderItem={(item) => (
                                                    <List.Item
                                                        key={item.id_noti}
                                                        className={cx('notification-item', { unread: !item.is_read })}
                                                        onClick={() => {
                                                            markAsRead(item.id_noti);
                                                        }}
                                                    >
                                                        <List.Item.Meta
                                                            title={
                                                                <div>
                                                                    <span>{item.title}</span>
                                                                    <div className={cx('notification-time')}>
                                                                        {dayjs(item.created_at).utc().format('HH:mm DD/MM/YYYY')}
                                                                    </div>
                                                                </div>
                                                            }
                                                            description={item.message}
                                                        />
                                                        {!item.is_read && <div className={cx('notification-dot')} />}
                                                    </List.Item>
                                                )}
                                                style={{ maxHeight: '400px'}}
                                                locale={{ emptyText: 'Không có thông báo nào' }}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className={cx('user')}>
                                <Dropdown menu={{ items }} placement="bottom" arrow>
                                    <a
                                        style={{
                                            color: 'white',
                                            fontSize: '1.5rem',
                                            cursor: 'pointer',
                                            maxWidth: '145px',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                        className="ant-dropdown-link"
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        <Avatar
                                            style={{ marginRight: '5px' }}
                                            size={39}
                                            src={currentUser?.avatar ? currentUser.avatar : null}
                                            icon={!currentUser?.avatar ? <UserOutlined /> : null}
                                        />
                                        <span
                                            style={{
                                                maxWidth: '105px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {currentUser?.name}
                                        </span>
                                    </a>
                                </Dropdown>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {notificationVisible && <div className={cx('overlay')} onClick={closeNotification}></div>}
        </header>
    );
}

export default Header;
