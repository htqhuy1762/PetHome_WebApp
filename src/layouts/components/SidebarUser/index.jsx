import classNames from 'classnames/bind';
import styles from './SidebarUser.module.scss';
import { Avatar, Menu, Skeleton } from 'antd';
import { UserOutlined, ContainerOutlined, ShopOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import * as userServices from '~/services/userServices';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function SidebarUser() {
    const location = useLocation();
    const [selectedKey, setSelectedKey] = useState(location.pathname);
    const items = [
        {
            key: 'sub1',
            label: 'Tài khoản của tôi',
            icon: <UserOutlined />,
            children: [
                { key: '/user/account/profile', label: <a href="/user/account/profile">Hồ sơ</a> },
                { key: '/user/account/address', label: <a href="/user/account/address">Địa chỉ</a> },
                { key: '/user/account/favorite-pet', label: <a href="/user/account/favorite-pet">Thú cưng yêu thích</a> },
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

    useEffect(() => {
        if (location.pathname.startsWith('/user/shop')) {
            setSelectedKey('/user/shop');
        } else {
            setSelectedKey(location.pathname);
        }
    }, [location.pathname]);

    if (loading) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('user')}>
                    <Skeleton.Avatar active size={46} />
                    <Skeleton active title={false} paragraph={{ rows: 1, width: '190px' }} />
                </div>
                <Skeleton active title={false} paragraph={{ rows: 4, width: 256 }} />
            </div>
        );
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
                <h4 style={{ width: '190px', wordWrap: 'break-word' }}>{userData?.name}</h4>
            </div>
            <Menu
                style={{ width: 256 }}
                defaultOpenKeys={['sub1']}
                mode="inline"
                items={items}
                selectedKeys={[selectedKey]}
            />
        </div>
    );
}

export default SidebarUser;