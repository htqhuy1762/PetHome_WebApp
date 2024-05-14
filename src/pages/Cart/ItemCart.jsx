import classNames from 'classnames/bind';
import styles from './ItemCart.module.scss';
import { Row, Col, Checkbox, Button } from 'antd';
import ItemCartElement from '~/components/ItemCartElement';
import { useState } from 'react';

const cx = classNames.bind(styles);

function ItemCart() {
    const [items, setItems] = useState([
        { id: 1, price: 1000000, selected: false },
        { id: 2, price: 500000, selected: false },
        { id: 3, price: 400000, selected: false },
    ]);
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setItems(items.map((item) => ({ ...item, selected: !selectAll })));
    };

    const handleSelectItem = (id) => {
        setItems(items.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)));
    };

    const total = items.reduce((sum, item) => (item.selected ? sum + item.price : sum), 0);

    return (
        <div className={cx('wrapper')}>
            <Row className={cx('header')}>
                <Col span={12}>
                    <p style={{ fontSize: '2rem' }}>Vật phẩm</p>
                </Col>
                <Col span={3}>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}>Đơn giá</p>
                </Col>
                <Col span={3}>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}>Số lượng</p>
                </Col>
                <Col span={3}>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}>Tình trạng</p>
                </Col>
                <Col span={3}>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}>Thao tác</p>
                </Col>
            </Row>
            {items.map((item) => (
                <ItemCartElement
                    key={item.id}
                    item={item}
                    selected={item.selected}
                    onSelect={() => handleSelectItem(item.id)}
                />
            ))}
            <Row className={cx('cal-all')}>
                <Col span={1} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Checkbox checked={selectAll} onChange={handleSelectAll} />
                </Col>
                <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ fontSize: '1.7rem' }}>Chọn tất cả</p>
                </Col>
                <Col span={3}></Col>
                <Col span={3}></Col>
                <Col span={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Row style={{ display: 'flex', justifyContent: 'center' }}>
                        <p style={{ fontSize: '1.7rem' }}>Tổng thanh toán:</p>
                    </Row>
                </Col>
                <Col span={5} style={{ display: 'flex', alignItems: 'center' }}>
                    <Row style={{ display: 'flex', justifyContent: 'center' }}>
                        <p style={{ fontSize: '2.4rem', color: 'var(--button-color)', fontWeight: '500' }}>
                            {total.toLocaleString('it-IT')} đ
                        </p>
                    </Row>
                </Col>
                <Col span={5} style={{ display: 'flex', alignItems: 'center' }}>
                    <Row style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button size="large" className={cx('btn')}>
                            Mua hàng
                        </Button>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default ItemCart;
