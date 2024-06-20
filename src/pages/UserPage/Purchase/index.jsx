import classNames from 'classnames/bind';
import styles from './Purchase.module.scss';
import { Tabs } from 'antd';

const cx = classNames.bind(styles);

function Purchase() {
    const items = [
        {
            key: '1',
            label: 'Chờ thanh toán',
            children: null,
        },
        {
            key: '2',
            label: 'Vận chuyển',
            children: null,
        },
        {
            key: '3',
            label: 'Chờ giao hàng',
            children: null,
        },
        {
            key: '4',
            label: 'Hoàn thành',
            children: null,
        },
        {
            key: '5',
            label: 'Đã hủy',
            children: null,
        },
    ];

    return <div className={cx('wrapper')}>
        <Tabs defaultActiveKey="1" items={items} size="middle" tabBarGutter={120} />
    </div>;
}

export default Purchase;
