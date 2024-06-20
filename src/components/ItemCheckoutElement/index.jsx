import { Image, Row, Col, Button, Input } from 'antd';
import classNames from 'classnames/bind';
import styles from './ItemCheckoutElement.module.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function CustomInputNumber({ id, quantityWant, onQuantityChange, fromCart, item }) {
    const [value, setValue] = useState(quantityWant|| 1);
    const [isEditable, setIsEditable] = useState(!fromCart);

    function increase() {
        const newValue = value + 1;
        if (!fromCart && newValue > item.quantity) {
            return; // Không cho tăng nếu vượt quá số lượng hiện có
        }
        setValue(newValue);
        onQuantityChange(id, newValue); // Gọi hàm này để cập nhật quantity
    }

    function decrease() {
        if (value > 1) {
            const newValue = value - 1;
            setValue(newValue);
            onQuantityChange(id, newValue); // Gọi hàm này để cập nhật quantity
        }
    }

    useEffect(() => {
        setIsEditable(!fromCart);
        setValue(quantityWant || 1); // Đặt lại value ban đầu khi fromCart thay đổi
    }, [fromCart, quantityWant]);

    return (
        <div className={cx('input-num')}>
            {isEditable && (
                <Button
                    style={{ width: '30px', display: 'flex', justifyContent: 'center' }}
                    onClick={decrease}
                >
                    -
                </Button>
            )}
            <Input style={{ textAlign: 'center', width: '60px' }} value={value} readOnly />
            {isEditable && (
                <Button
                    style={{ width: '30px', display: 'flex', justifyContent: 'center' }}
                    onClick={increase}
                    disabled={!fromCart && value >= item.quantity}
                >
                    +
                </Button>
            )}
        </div>
    );
}

function ItemCheckoutElement({ item, onQuantityChange }) {
    const [quantityWant, setQuantityWant] = useState(item.quantityWant || 1);

    useEffect(() => {
        setQuantityWant(item.quantityWant || 1);
    }, [item.quantityWant]);

    const [totalPrice, setTotalPrice] = useState(item.price * (item.quantityWant || 1));

    useEffect(() => {
        // Tính toán tổng giá trị khi số lượng thay đổi
        const newTotalPrice = item.price * quantityWant;
        setTotalPrice(newTotalPrice);
        onQuantityChange(item.id_item_detail, quantityWant); 
    }, [quantityWant]);

    const handleQuantityChange = (id, newValue) => {
        setQuantityWant(newValue);
    };

    return (
        <Row className={cx('cart-item')}>
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
                        fallback="data:image/png;base64,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"
                    />
                </Link>
            </Col>
            <Col span={5}>
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
                    <p className={cx('type-item')}>
                        {item.size} {item.unit}
                    </p>
                </Row>
            </Col>
            <Col span={4}>
                <Row>
                    <p className={cx('price')}>{item.price.toLocaleString('vi-VN')}đ</p>
                </Row>
            </Col>
            <Col span={4}>
                <Row className={cx('input-quantity')}>
                    <CustomInputNumber
                        id={item.id_item_detail}
                        quantityWant={quantityWant}
                        onQuantityChange={handleQuantityChange}
                        fromCart={item.fromCart}
                        item={item}
                    />
                    {!item.fromCart && (
                        <span>Số lượng hiện có: {item.quantity}</span>
                    )}
                </Row>
            </Col>
            <Col span={4}>
                <Row>
                    <p className={cx('price')}>{totalPrice.toLocaleString('vi-VN')}đ</p>
                </Row>
            </Col>
        </Row>
    );
}

export default ItemCheckoutElement;
