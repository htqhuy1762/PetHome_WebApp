import classNames from 'classnames/bind';
import styles from './Bill.module.scss';
import PropTypes from 'prop-types';
import { Image, Button, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
    CalendarOutlined,
    EnvironmentOutlined,
    MoneyCollectOutlined,
    SafetyCertificateOutlined,
    ShopOutlined,
    PhoneOutlined,
    WalletOutlined,
} from '@ant-design/icons';

dayjs.extend(utc);

const cx = classNames.bind(styles);

const statusMap = {
    pending: 'Chưa nhận đơn',
    preparing: 'Đã nhận đơn',
    delivering: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    done: 'Đã hoàn thành',
    canceled: 'Đã hủy',
};

function Bill({ bill, onCancel, onPayment }) {
    const formattedDate = dayjs.utc(bill.created_at).utcOffset(7).format('HH:mm DD/MM/YYYY');
    const statusText = statusMap[bill.status] || bill.status;
    const getStatusColor = (status) => {
        switch (status) {
            case 'canceled':
                return 'red';
            case 'done':
                return 'green';
            default:
                return 'var(--primary)';
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('shop-status')}>
                <p style={{ fontWeight: 600, fontSize: '1.8rem' }}>
                    <ShopOutlined /> {bill.shop_name}
                </p>
                <p style={{ color: getStatusColor(bill.status), fontWeight: 500, fontSize: '1.6rem' }}>{statusText}</p>
            </div>
            <div className={cx('content')}>
                <div className={cx('image')}>
                    <Image src={bill.item_image} style={{ width: 200, height: 200 }} preview={false} />
                </div>
                <div className={cx('info')}>
                    <p style={{ fontSize: '2rem', fontWeight: 600 }}>{bill.item_name}</p>
                    <p style={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                        Phân loại hàng:{' '}
                        <span>
                            {bill.item_size}
                            {bill.item_unit}
                        </span>
                    </p>
                    <p>x{bill.quantity}</p>
                    <p>
                        <span style={{ fontWeight: 500 }}>
                            <MoneyCollectOutlined /> Giá:
                        </span>{' '}
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                            {bill.price.toLocaleString('vi-VN')}đ
                        </span>
                    </p>
                    <p>
                        <span style={{ fontWeight: 500 }}>
                            <PhoneOutlined /> Số điện thoại:
                        </span>{' '}
                        {bill.phone_number}
                    </p>
                    <p>
                        <span style={{ fontWeight: 500 }}>
                            <WalletOutlined /> Phương thức thanh toán:
                        </span>{' '}
                        {bill.payment_description}
                        {' - '}
                        <span style={{ fontWeight: 500, color: bill.payment_status === 'pending' ? 'red' : 'green' }}>
                            {bill.payment_status === 'pending' ? 'Chưa thanh toán' : 'Đã thanh toán'}
                        </span>{' '}
                    </p>
                    <p>
                        <span style={{ fontWeight: 500 }}>
                            <CalendarOutlined /> Thời gian đặt hàng:
                        </span>{' '}
                        {formattedDate}
                    </p>

                    <p>
                        <span style={{ fontWeight: 500 }}>
                            <EnvironmentOutlined /> Địa chỉ nhận hàng:
                        </span>{' '}
                        {bill.address}
                    </p>
                </div>
            </div>
            <div className={cx('action')}>
                <div>
                    {bill.payment_status === 'pending' && bill.payment_description === 'Ví điện tử VNPAY' && (
                        <span style={{ color: 'red' }}>
                            Bạn cần phải thanh toán đơn hàng này trước khi đơn hàng tiếp tục được xử lý!
                        </span>
                    )}
                    <p style={{ display: 'flex', alignItems: 'center' }}>
                        <SafetyCertificateOutlined style={{ marginRight: 3 }} /> Tổng cộng:
                        <span
                            style={{
                                fontSize: '2.4rem',
                                color: 'var(--primary)',
                                lineHeight: '30px',
                                fontWeight: 600,
                                marginLeft: 7,
                            }}
                        >
                            {bill.total_price.toLocaleString('vi-VN')}đ
                        </span>
                    </p>
                </div>
                <div className={cx('list-button')}>
                    {bill.payment_description === 'Ví điện tử VNPAY' && bill.payment_status === 'pending' && (
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        defaultColor: 'green',
                                        defaultBg: 'white',
                                        defaultBorderColor: 'green',
                                        defaultHoverBorderColor: 'green',
                                        defaultHoverBg: 'white',
                                        defaultHoverColor: 'green',
                                    },
                                },
                            }}
                        >
                            <Button style={{ marginLeft: 10 }} onClick={() => onPayment(bill.id_bill)}>
                                Thanh toán
                            </Button>
                        </ConfigProvider>
                    )}

                    {bill.status === 'pending' && (
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        defaultColor: 'red',
                                        defaultBg: 'white',
                                        defaultBorderColor: 'red',
                                        defaultHoverBorderColor: 'red',
                                        defaultHoverBg: 'white',
                                        defaultHoverColor: 'red',
                                    },
                                },
                            }}
                        >
                            <Button style={{ marginLeft: 10 }} onClick={() => onCancel(bill.id_bill)}>
                                Hủy đơn hàng
                            </Button>
                        </ConfigProvider>
                    )}
                </div>
            </div>
        </div>
    );
}

Bill.propTypes = {
    bill: PropTypes.object.isRequired,
    onCancel: PropTypes.func,
    onPayment: PropTypes.func,
};

export default Bill;
