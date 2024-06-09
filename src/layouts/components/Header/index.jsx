import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import logo from '~/assets/images/logo.png';
import logotitle from '~/assets/images/logo-title.png';
import { Input, Button, Dropdown, Avatar, Select } from 'antd';
import { ShoppingCartOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userServices from '~/services/userServices';
import * as authServices from '~/services/authServices';
import Loading from '~/components/Loading';
import { AuthContext } from '~/components/AuthProvider/index.jsx';

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

    if (loading) {
        return <Loading />;
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
                            <div className={cx('user')}>
                                <Dropdown menu={{ items }} placement="bottom" arrow>
                                    <a
                                        style={{
                                            color: 'white',
                                            fontSize: '1.5rem',
                                            cursor: 'pointer',
                                            maxWidth: '140px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
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
                                        <span>{currentUser?.name}</span>
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
