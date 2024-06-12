import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { Tabs } from 'antd';
import PetCart from './PetCart';
import ItemCart from './ItemCart';

const cx = classNames.bind(styles);

function Cart() {

    const tabs = [
        {
            key: '1',
            label: 'Thú cưng',
            children: <PetCart />
        },
        {
            key: '2',
            label: 'Vật phẩm',
            children: <ItemCart />
        }
    ];

    return (
        <div className={cx('wrapper')}>
            <h1>Giỏ hàng</h1>
            <Tabs defaultActiveKey="1" type='card' items={tabs} />
        </div>
    );
}

export default Cart;