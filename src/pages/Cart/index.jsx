import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { Tabs } from 'antd';
import PetCart from './PetCart';
import ItemCart from './ItemCart';

const cx = classNames.bind(styles);

function Cart() {
    const [currentTab, setCurrentTab] = useState('1');

    const onChange = (key) => {
        setCurrentTab(key);
    };

    const tabs = [
        {
            key: '1',
            label: 'Thú cưng',
            children: currentTab === '1' && <PetCart />
        },
        {
            key: '2',
            label: 'Vật phẩm',
            children: currentTab === '2' && <ItemCart />
        }
    ];

    return (
        <div className={cx('wrapper')}>
            <h1>Giỏ hàng</h1>
            <Tabs defaultActiveKey="1" type='card' onChange={onChange} items={tabs} />
        </div>
    );
}

export default Cart;