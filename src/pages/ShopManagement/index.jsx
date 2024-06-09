import classNames from 'classnames/bind';
import styles from './ShopManagement.module.scss';
import { Menu } from 'antd';
import { useState, useEffect } from 'react';

const cx = classNames.bind(styles);

function ShopManagement() {
    const items = [
        {
            key: '1',
            label: 'Quản lý đơn hàng',
            children: [
                {
                    key: '1.1',
                    label: 'Tất cả',
                },
                {
                    key: '1.2',
                    label: 'Đơn hủy',
                },
                {
                    key: '1.3',
                    label: 'Trả hàng/Hoàn tiền',
                },
            ],
        },
        {
            key: '2',
            label: 'Quản lý sản phẩm',
            children: [
                {
                    key: '2.1',
                    label: 'Thú cưng',
                },
                {
                    key: '2.2',
                    label: 'Vật phẩm',
                },
                {
                    key: '2.3',
                    label: 'Dịch vụ',
                },
            ],
        },
        {
            key: '3',
            label: 'Quản lý doanh thu',
            children: [],
        },
        {
            key: '4',
            label: 'Thông tin cửa hàng',
            children: [],
        },
    ];

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h1>Quản lý cửa hàng</h1>
            </div>

            <div>
                <div className={cx('sidebar')}>
                    <div className={cx('Shop')}>
                        
                    </div>
                    <Menu
                        style={{ width: 256 }}
                        defaultOpenKeys={items.map((item) => item.key)}
                        mode="inline"
                        items={items}
                        selectedKeys={[]}
                    />
                </div>
                <div className={cx('content')}></div>
            </div>
        </div>
    );
}

export default ShopManagement;
