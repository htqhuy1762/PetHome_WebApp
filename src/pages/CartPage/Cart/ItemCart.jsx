import classNames from 'classnames/bind';
import styles from './ItemCart.module.scss';
import { Row, Col, Checkbox, Button, message, Empty } from 'antd';
import ItemCartElement from '~/components/ItemCartElement';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as cartServices from '~/services/cartServices';
import Loading from '~/components/Loading';
import CartEmpty from '~/assets/images/CartEmpty.png';
import CryptoJS from 'crypto-js';

const cx = classNames.bind(styles);
const secretKey = import.meta.env.VITE_APP_SECRET_KEY;

function ItemCart() {
    const [messageApi, contextHolder] = message.useMessage();
    const [items, setItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Xóa vật phẩm thành công',
        });
    };

    const errorMessage = () => {
        messageApi.open({
            type: 'error',
            content: 'Xóa vật phẩm thất bại',
        });
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setItems((prevItems) =>
            prevItems.map((item) => (item.instock ? { ...item, selected: newSelectAll } : item))
        );
    };

    const handleSelectItem = (id) => {
        setItems(items.map((item) => (item.id_item_detail === id ? { ...item, selected: !item.selected } : item)));
    };

    const handleQuantityChange = (id, quantityWant) => {
        setItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id_item_detail === id) {
                    return { ...item, quantityWant };
                }
                return item;
            })
        );
    };

    const total = items.reduce((sum, item) => (item.selected ? sum + item.price * item.quantityWant : sum), 0);

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const response = await cartServices.getItemsCart();
                if (response.status === 200 && response.data.data) {
                    setItems(response.data.data.map((item) => ({ ...item, selected: false, quantityWant: 1 })));
                }
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
        };
        fetchItems();
    }, []);

    const handleRemoveItem = async (id) => {
        try {
            const response = await cartServices.removeItemFromCart(id);
            if (response && response.status === 200) {
                setItems(items.filter((item) => item.id_item_detail !== id));
                success();
            } else {
                console.error('Failed to remove item from cart');
                errorMessage();
            }
        } catch (error) {
            console.error('Failed to remove item from cart', error);
            console.log('Error:', error);
        }
    };

    const handleCheckout = () => {
        const selectedItems = items.filter((item) => item.selected);
        const itemsWithFromCart = selectedItems.map((item) => ({ ...item, fromCart: true }));
        const itemsString = JSON.stringify(itemsWithFromCart);
        const encryptedItems = CryptoJS.AES.encrypt(itemsString, secretKey).toString();
        navigate(`/checkout?data=${encodeURIComponent(encryptedItems)}`);
    };

    if (isLoading) {
        return <Loading />;
    }

    if (items.length === 0) {
        return (
            <div className={cx('wrapper')}>
                {contextHolder}
                <Empty description="Giỏ hàng trống" image={CartEmpty} />
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            {contextHolder}
            <Row className={cx('header')}>
                <Col span={12}>
                    <p style={{ fontSize: '2rem' }}>Vật phẩm</p>
                </Col>
                <Col span={3}>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}>Đơn giá</p>
                </Col>
                <Col span={4}>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}>Số lượng</p>
                </Col>
                <Col span={2}>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}>Tình trạng</p>
                </Col>
                <Col span={3}>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}>Thao tác</p>
                </Col>
            </Row>
            {items.map((item) => (
                <ItemCartElement
                    key={item.id_item_detail}
                    item={item}
                    selected={item.selected}
                    onSelect={() => handleSelectItem(item.id_item_detail)}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                />
            ))}
            <Row className={cx('cal-all')}>
                <Col span={1} style={{ display: 'flex', justifyContent: 'center' }}>
                    <Checkbox checked={selectAll} onChange={handleSelectAll} indeterminate={items.some((item) => item.instock && !item.selected) && items.some((item) => item.selected)}/>
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
                        <p style={{ fontSize: '2.4rem', color: 'var(--button-next-color)', fontWeight: '500' }}>
                            {total.toLocaleString('it-IT')} đ
                        </p>
                    </Row>
                </Col>
                <Col span={5} style={{ display: 'flex', alignItems: 'center' }}>
                    <Row style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button size="large" className={cx('btn')} onClick={handleCheckout}>
                            Mua hàng
                        </Button>
                    </Row>
                </Col>
            </Row>
        </div>
    );
}

export default ItemCart;