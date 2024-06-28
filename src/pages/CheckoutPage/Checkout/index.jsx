import classNames from 'classnames/bind';
import styles from './Checkout.module.scss';
import { Modal, Button, Radio, Row, Col, ConfigProvider, message, Input } from 'antd';
import * as userServices from '~/services/userServices';
import * as paymentServices from '~/services/paymentServices';
import * as billServices from '~/services/billServices';
import { useState, useEffect } from 'react';
import { EnvironmentFilled } from '@ant-design/icons';
import ZaloPayLogo from '~/assets/images/ZaloPay.png';
import VNPayLogo from '~/assets/images/VNPay.png';
import CashLogo from '~/assets/images/Cash.png';
import ItemCheckoutElement from '~/components/ItemCheckoutElement';
import { useLocation } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import * as cartServices from '~/services/cartServices';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);
const secretKey = import.meta.env.VITE_APP_SECRET_KEY;

function Checkout() {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalPhoneNumVisible, setIsModalPhoneNumVisible] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedArea, setselectedArea] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(1);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedPhoneNum, setSelectedPhoneNum] = useState('');
    const [tempPhoneNum, setTempPhoneNum] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [paymentMethods, setPaymentMethods] = useState([]);

    const location = useLocation();

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await paymentServices.getPaymentMethods(); // Giả sử bạn có hàm này trong userServices
                if (response.status === 200) {
                    setPaymentMethods(response.data);
                    if (response.data.length > 0) {
                        setSelectedPayment(response.data[0].id_method); // Chọn phương thức thanh toán đầu tiên mặc định
                    }
                }
            } catch (error) {
                console.error('Failed to fetch payment methods', error);
            }
        };

        fetchPaymentMethods();
    }, []);

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await userServices.getUserAddress();
                if (response.status === 200) {
                    setAddresses(response.data);
                    if (response.data.length > 0) {
                        setSelectedAddress(response.data[0].address); // Chọn địa chỉ đầu tiên mặc định
                        setselectedArea(response.data[0].area);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch addresses', error);
                // Handle error
            }
        };

        fetchAddresses();
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const encryptedData = searchParams.get('state');

        if (encryptedData) {
            const decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedData), secretKey);
            const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

            try {
                const parsedData = JSON.parse(decryptedData);

                // Ensure parsedData is always an array
                const parsedItems = Array.isArray(parsedData) ? parsedData : [parsedData];

                setSelectedItems(parsedItems);
            } catch (error) {
                console.error('Error parsing decrypted data:', error);
                // Handle parsing error
            }
        }
    }, [location.search]);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await userServices.getUser();
                if (response.status === 200) {
                    setUserData(response.data);
                    setSelectedPhoneNum(response.data.phone_num);
                }
            } catch (error) {
                // Handle error
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        const calculateTotalAmount = () => {
            const total = selectedItems.reduce((acc, item) => acc + item.price * item.quantityWant, 0);
            setTotalAmount(total);
        };

        calculateTotalAmount();
    }, [selectedItems]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const showModalPhoneNum = () => {
        setTempPhoneNum(selectedPhoneNum);
        setIsModalPhoneNumVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handlePhoneNumOk = () => {
        setSelectedPhoneNum(tempPhoneNum);
        setIsModalPhoneNumVisible(false);
    };

    const handlePhoneNumCancel = () => {
        setIsModalPhoneNumVisible(false);
    };

    const handleAddressChange = (e) => {
        const selectedAddr = addresses.find((addr) => addr.address === e.target.value);
        if (selectedAddr) {
            setSelectedAddress(selectedAddr.address);
            setselectedArea(selectedAddr.area);
        }
    };

    const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value);
    };

    const handleQuantityChange = (id, newValue) => {
        // Update quantity of selected items
        const updatedItems = selectedItems.map((item) => {
            if (item.id_item_detail === id) {
                return { ...item, quantityWant: newValue };
            }
            return item;
        });
        setSelectedItems(updatedItems);
    };

    const handleOrder = async () => {
        try {
            if (!selectedArea || !selectedAddress || !selectedPhoneNum) {
                message.error('Bạn cần hoàn tất các thông tin cá nhân trước khi thanh toán');
                return;
            }
            const formData = new FormData();
            formData.append('area', selectedArea);
            formData.append('id_method', selectedPayment);
            formData.append('address', selectedAddress);
            formData.append('phone_number', selectedPhoneNum);
            selectedItems.forEach((item) => {
                let itemString = `${item.id_item}^${item.id_item_detail}^${item.quantityWant}`;
                formData.append('cart', itemString);
            });

            const response = await billServices.createBill(formData);

            if (response.status === 200) {
                message.success('Đặt hàng thành công');

                const itemsFromCart = selectedItems.filter((item) => item.fromCart);
                if (itemsFromCart.length > 0) {
                    const removeItemPromises = itemsFromCart.map((item) =>
                        cartServices.removeItemFromCart(item.id_item_detail),
                    );
                    await Promise.all(removeItemPromises);
                }
                navigate('/user/purchase');
            } else {
                const itemsFromCart = selectedItems.filter((item) => item.fromCart);
                if (itemsFromCart.length > 0) {
                    message.error('Đặt hàng thất bại đặt quá số lượng hiện có, vui lỏng kiểm tra lại giỏ hàng');
                } else {
                    message.error('Đặt hàng thất bại do đặt quá số lượng hiện có');
                }
            }
        } catch (error) {
            console.error('Failed to create bill', error);
            message.error('Đặt hàng thất bại');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h1>Thanh toán</h1>
            <div className={cx('address')}>
                <div className={cx('address-title')}>
                    <EnvironmentFilled style={{ fontSize: '2rem' }} />
                    <h2 style={{ margin: '5px' }}>Địa chỉ nhận hàng</h2>
                </div>
                <div className={cx('address-content')}>
                    <div className={cx('user')}>
                        <span style={{ fontWeight: 600, fontSize: '1.8rem' }}>{userData?.name}</span>
                        <span style={{ marginLeft: 8, fontWeight: 600, fontSize: '1.8rem' }}>{selectedPhoneNum}</span>
                        <Button
                            type="link"
                            style={{ marginLeft: 10, textTransform: 'capitalize' }}
                            onClick={showModalPhoneNum}
                        >
                            Thay đổi
                        </Button>
                    </div>
                    <div className={cx('address-user')}>
                        {addresses && addresses.length > 0 ? (
                            <>
                                <span>{addresses.find((addr) => addr.address === selectedAddress)?.address}</span>
                                <Button
                                    type="link"
                                    style={{ marginLeft: 10, textTransform: 'capitalize' }}
                                    onClick={showModal}
                                >
                                    Thay đổi
                                </Button>
                            </>
                        ) : (
                            <span>Không có địa chỉ</span>
                        )}
                    </div>
                </div>
            </div>
            <div className={cx('production')}>
                <Row className={cx('header')}>
                    <Col span={12}>
                        <p style={{ fontSize: '2rem' }}>Vật phẩm</p>
                    </Col>
                    <Col span={4}>
                        <p style={{ fontSize: '2rem', textAlign: 'center' }}>Đơn giá</p>
                    </Col>
                    <Col span={4}>
                        <p style={{ fontSize: '2rem', textAlign: 'center' }}>Số lượng</p>
                    </Col>
                    <Col span={4}>
                        <p style={{ fontSize: '2rem', textAlign: 'center' }}>Thành tiền</p>
                    </Col>
                </Row>

                {selectedItems.map((item) => (
                    <ItemCheckoutElement
                        key={item.id_item_detail}
                        item={item}
                        onQuantityChange={handleQuantityChange}
                    />
                ))}
            </div>
            <div className={cx('payment-method')}>
                <h2>Phương thức thanh toán</h2>
                <Radio.Group
                    onChange={handlePaymentChange}
                    style={{ display: 'flex', justifyContent: 'space-around', padding: '30px 0' }}
                    value={selectedPayment}
                >
                    {paymentMethods.map((method) => (
                        <div key={method.id_method} className={cx('payment-option')}>
                            <Radio value={method.id_method}>
                                <div className={cx('payment-content')}>
                                    <img
                                        src={
                                            method.name === 'CASH'
                                                ? CashLogo
                                                : method.name === 'ZALO'
                                                ? ZaloPayLogo
                                                : VNPayLogo
                                        }
                                        alt={method.name}
                                        className={cx('payment-logo')}
                                    />
                                    <span>{method.description}</span>
                                </div>
                            </Radio>
                            {selectedPayment === method.id_method && <span className={cx('checkmark')}>&#10004;</span>}
                        </div>
                    ))}
                </Radio.Group>
                <div className={cx('actions')}>
                    <p style={{ fontSize: '1.7rem' }}>
                        Tổng thanh toán:{' '}
                        <span style={{ fontSize: '2.4rem', color: 'var(--button-next-color)', fontWeight: '500' }}>
                            {totalAmount.toLocaleString('vi-VN')}đ
                        </span>{' '}
                    </p>
                    <ConfigProvider
                        theme={{
                            components: {
                                Button: {
                                    defaultColor: 'white',
                                    defaultBg: 'var(--button-next-color)',
                                    defaultBorderColor: 'var(--button-next-color)',
                                    defaultHoverBorderColor: 'var(--button-next-color)',
                                    defaultHoverBg: 'var(--button-next-color)',
                                    defaultHoverColor: 'white',
                                },
                            },
                        }}
                    >
                        <Button size="large" className={cx('btn')} onClick={handleOrder}>
                            Đặt hàng
                        </Button>
                    </ConfigProvider>
                </div>
            </div>

            <Modal
                title="Thay đổi số điện thoại"
                open={isModalPhoneNumVisible}
                onOk={handlePhoneNumOk}
                onCancel={handlePhoneNumCancel}
            >
                <Input
                    style={{ width: '100%' }}
                    value={tempPhoneNum}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^[0-9]*$/.test(value)) {
                            setTempPhoneNum(value);
                        }
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                />
            </Modal>

            <Modal title="Chọn địa chỉ" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Radio.Group onChange={handleAddressChange} value={selectedAddress}>
                    {addresses.map((address) => (
                        <Radio key={address.id_address} value={address.address}>
                            {address.address}
                        </Radio>
                    ))}
                </Radio.Group>
            </Modal>
        </div>
    );
}

export default Checkout;
