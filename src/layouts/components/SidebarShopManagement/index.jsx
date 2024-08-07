import classNames from 'classnames/bind';
import styles from './SidebarShopManagement.module.scss';
import { Menu, Avatar } from 'antd';
import { useState, useEffect } from 'react';
import * as shopServices from '~/services/shopServices';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function SidebarShopManagement() {
    const [shopData, setShopData] = useState(null);
    const [selectedKey, setSelectedKey] = useState('');

    const items = [
        {
            key: '1',
            label: <Link to="/user/shop/management/bill">Quản lý đơn hàng</Link>,
            children: null,
        },
        {
            key: '2',
            label: 'Quản lý sản phẩm',
            children: [
                {
                    key: '2.1',
                    label: <Link to="/user/shop/management/pet">Thú cưng</Link>,
                },
                {
                    key: '2.2',
                    label: <Link to="/user/shop/management/item">Vật phẩm</Link>,
                },
                {
                    key: '2.3',
                    label: <Link to="/user/shop/management/service">Dịch vụ</Link>,
                },
            ],
        },
        {
            key: '3',
            label: <Link to="/user/shop/management/income">Quản lý doanh thu</Link>,
            children: null,
        },
        {
            key: '4',
            label: 'Thông tin cửa hàng',
            children: [
                {
                    key: '4.1',
                    label: <Link to="/user/shop/management/profile">Thông tin chi tiết</Link>,
                },
                {
                    key: '4.2',
                    label: <Link to="/user/shop/management/address">Địa chỉ</Link>,
                },
            ],
        },
    ];

    useEffect(() => {
        const fetchShop = async () => {
            try {
                const idShop = localStorage.getItem('idShop');
                const response = await shopServices.getShopInfo(idShop);
                if (response.status === 200) {
                    setShopData(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchShop();
    }, []);

    const handleSelect = ({ key }) => {
        setSelectedKey(key);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('shop')}>
                <Avatar
                    src={shopData?.logo ? shopData.logo : null}
                    icon={!shopData?.logo ? <UserOutlined /> : null}
                    size={46}
                    style={{ border: '1px solid rgb(0, 0, 0, 0.25)', marginRight: '7px' }}
                />
                <h4 style={{ width: '190px', wordWrap: 'break-word' }}>{shopData?.name}</h4>
            </div>
            <Menu
                style={{ width: 256.8 }}
                defaultOpenKeys={items.map((item) => item.key)}
                mode="inline"
                items={items}
                selectedKeys={[selectedKey]}
                onClick={handleSelect}
            />
        </div>
    );
}

export default SidebarShopManagement;
