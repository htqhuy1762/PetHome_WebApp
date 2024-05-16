//import { Card, InputNumber, Button, Image } from 'antd';
import { Image, Row, Col, Button, Input, Checkbox } from 'antd';
import classNames from 'classnames/bind';
import styles from './ItemCartElement.module.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function CustomInputNumber({ id, onQuantityChange }) {
    const [value, setValue] = useState(1);

    function increase() {
        const newValue = value + 1;
        setValue(newValue);
        onQuantityChange(id, newValue);
    }

    function decrease() {
        if (value > 1) {
            const newValue = value - 1;
            setValue(newValue);
            onQuantityChange(id, newValue);
        }
    }

    return (
        <div className={cx('input-num')}>
            <Button style={{ width: '30px', display: 'flex', justifyContent: 'center' }} onClick={decrease}>
                -
            </Button>
            <Input style={{ textAlign: 'center', width: '60px' }} value={value} readOnly />
            <Button style={{ width: '30px', display: 'flex', justifyContent: 'center' }} onClick={increase}>
                +
            </Button>
        </div>
    );
}

function ItemCartElement({ item, selected, onSelect, onQuantityChange, onRemove }) {
    return (
        <Row className={cx('cart-item')}>
            <Col span={1} style={{ display: 'flex', justifyContent: 'center' }}>
                <Checkbox checked={selected} onChange={onSelect} />
            </Col>
            <Col span={4}>
                <Link to={`/items/${item.id_item}`}>
                    <Image
                        style={{
                            width: '150px',
                            height: '150px',
                            border: '1px solid rgba(0,0,0,0.15)',
                        }}
                        preview={false}
                        alt="example"
                        src={item.picture}
                    />
                </Link>
            </Col>
            <Col span={4}>
                <Row>
                    <Link to={`/items/${item.id_item}`}>
                        <p className={cx('item-name')}>{item.name}</p>
                    </Link>
                </Row>
                <Row>
                    <p className={cx('shop-name')}>{item.shop_name}</p>
                </Row>
            </Col>
            <Col span={3}>
                <Row>
                    <p className={cx('type')}>Phân loại hàng:</p>
                </Row>
                <Row>
                    <p className={cx('type-item')}>1 cái</p>
                </Row>
            </Col>
            <Col span={3}>
                <Row>
                    <p className={cx('price')}>{item.price.toLocaleString('vi-VN')}đ</p>
                </Row>
            </Col>
            <Col span={4}>
                <Row className={cx('input-quantity')}>
                    <CustomInputNumber id={item.id_item_detail} onQuantityChange={onQuantityChange} />
                </Row>
            </Col>
            <Col span={2}>
                <p className={cx('stock', item?.instock ? 'in-stock' : 'out-of-stock')}>
                    {item?.instock ? 'Còn hàng' : 'Hết hàng'}
                </p>
            </Col>
            <Col span={3}>
                <Button className={cx('remove-btn')} danger type="text" onClick={() => onRemove(item.id_item_detail)}>
                    Xóa
                </Button>
            </Col>
        </Row>
    );
}

export default ItemCartElement;
