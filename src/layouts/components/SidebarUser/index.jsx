import classNames from 'classnames/bind';
import styles from './SidebarUser.module.scss';
import { Avatar, Menu } from 'antd';
import { UserOutlined, ContainerOutlined, ShopOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import * as userServices from '~/services/userServices';
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
            key: '/user/purchase',
            label: <a href="/user/purchase">Đơn mua</a>,
            icon: <ContainerOutlined />,
        },
        {
            key: '/user/shop',
            label: <a href="/user/shop">Shop của tôi</a>,
            icon: <ShopOutlined />,
        },
    ];
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            try {
                const response = await userServices.getUser();
                if (response.status === 200) {
                    setUserData(response.data);
                }
            } catch (error) {
                // Handle error
            }
            setLoading(false);
        };

        getUser();
    }, []);

    if (loading) {
        return <Loading />; 
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
