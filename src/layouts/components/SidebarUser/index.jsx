import classNames from 'classnames/bind';
import styles from './SidebarUser.module.scss';
import { Avatar, Menu } from 'antd';
import { UserOutlined, ContainerOutlined, ShopOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import * as userServices from '~/services/userServices';
import * as authServices from '~/services/authServices';
import Loading from '~/components/Loading';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function SidebarUser() {
    const location = useLocation();
    const items = [
        {
            key: 'sub1',
            label: 'Tài khoản của tôi',
            icon: <UserOutlined />,
            children: [
                { key: '/user/account/profile', label: <a href="/user/account/profile">Hồ sơ</a> },
                { key: '/user/account/payment', label: <a href="/user/account/payment">Phương thức thanh toán</a> },
                { key: '/user/account/address', label: <a href="/user/account/address">Địa chỉ</a> },
                { key: '/user/account/changepass', label: <a href="/user/account/changepass">Đổi mật khẩu</a> },
            ],
        },
        {
            key: 'sub2',
            label: 'Đơn mua',
            icon: <ContainerOutlined />,
        },
        {
            key: 'sub3',
            label: 'Shop của tôi',
            icon: <ShopOutlined />,
        },
    ];
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

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
                        setUserData(response.data);
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

    if (loading) {
        return <Loading />; // Replace with your loading component or spinner
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('user')}>
                <Avatar
                    src={userData?.avatar ? userData.avatar : null}
                    icon={!userData?.avatar ? <UserOutlined /> : null}
                    size={46}
                    style={{ border: '1px solid rgb(0, 0, 0, 0.25)', marginRight: '7px' }}
                />
                <h4 style={{ width: '190px', wordWrap: 'break-word' }}>{userData?.email}</h4>
            </div>
            <Menu
                style={{ width: 256 }}
                defaultOpenKeys={['sub1', 'sub2', 'sub3', 'sub4']}
                mode="inline"
                items={items}
                selectedKeys={[location.pathname]}
            />
        </div>
    );
}

export default SidebarUser;
