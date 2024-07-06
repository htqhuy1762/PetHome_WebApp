import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { Tabs } from 'antd';
import ItemCart from './ItemCart';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo } from 'react';

const cx = classNames.bind(styles);

function Cart() {
    const location = useLocation();
    const navigate = useNavigate();

    const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
    const activeTabKey = query.get('type') || '1';

    const tabs = [
        // {
        //     key: '1',
        //     label: 'Thú cưng',
        //     children: <PetCart />,
        // },
        {
            key: '1',
            label: 'Vật phẩm',
            children: <ItemCart />,
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
            <h1>Giỏ hàng</h1>
            <Tabs
                defaultActiveKey={activeTabKey}
                activeKey={activeTabKey}
                type="card"
                items={tabs}
                onChange={handleTabChange}
            />
        </div>
    );
}

export default Cart;
