import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames/bind';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Purchase.module.scss';
import { Tabs } from 'antd';
import ListAllBill from './ListAllBill';
import ListDoneBill from './ListDoneBill';
import ListCanceledBill from './ListCanceledBill';
import ListNewBill from './ListNewBill';

const cx = classNames.bind(styles);

function Purchase() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCanceled, setIsCanceled] = useState(false);

    const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const activeTabKey = query.get('type') || '1';

    const items = [
        {
            key: '1',
            label: 'Đơn hàng đã đặt',
            children: <ListNewBill isCanceled={isCanceled} setIsCanceled={setIsCanceled} />,
        },
        {
            key: '2',
            label: 'Đơn hàng chờ xử lý',
            children: <ListAllBill/>,
        },
        {
            key: '3',
            label: 'Đơn hàng thành công',
            children: <ListDoneBill />,
        },
        {
            key: '4',
            label: 'Đơn hàng bị hủy',
            children: <ListCanceledBill isCanceled={isCanceled} />,
        },
    ];

    const handleTabChange = (key) => {
        navigate(`?type=${key}`);
    };

    useEffect(() => {
        const tabType = query.get('type');
        if (!tabType) {
            navigate(`?type=1`, { replace: true });
        }
    }, [navigate, query]);

    return (
        <div className={cx('wrapper')}>
            <h1 style={{ color: 'var(--button-next-color)' }}>Danh sách đơn hàng</h1>
            <Tabs
                defaultActiveKey={activeTabKey}
                activeKey={activeTabKey}
                onChange={handleTabChange}
                items={items}
                size="large"
                centered
                tabBarGutter={100}
            />
        </div>
    );
}

export default Purchase;
