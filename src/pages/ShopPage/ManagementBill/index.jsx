import classNames from 'classnames/bind';
import styles from './ManagementBill.module.scss';
import ListNewBillShop from './ListNewBillShop';
import ListAllBillShop from './ListAllBillShop';
import ListDoneBillShop from './ListDoneBillShop';
import ListCanceledBillShop from './ListCanceledBillShop';
import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs } from 'antd';

const cx = classNames.bind(styles);

function ManagementBill() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isUpdate, setIsUpdate] = useState(false);
    const [isCanceled, setIsCanceled] = useState(false);

    const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const activeTabKey = query.get('type') || '1';

    const items = [
        {
            key: '1',
            label: 'Đơn hàng mới',
            children: (
                <ListNewBillShop
                    isUpdate={isUpdate}
                    isCanceled={isCanceled}
                    setIsUpdate={setIsUpdate}
                    setIsCanceled={setIsCanceled}
                />
            ),
        },
        {
            key: '2',
            label: 'Đơn hàng đang xử lý',
            children: <ListAllBillShop isUpdate={isUpdate} setIsUpdate={setIsUpdate} />,
        },
        {
            key: '3',
            label: 'Đơn hàng thành công',
            children: <ListDoneBillShop isUpdate={isUpdate} />,
        },
        {
            key: '4',
            label: 'Đơn hàng bị hủy',
            children: <ListCanceledBillShop isCanceled={isCanceled} />,
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
                tabBarGutter={110}
            />
        </div>
    );
}

export default ManagementBill;
