import classNames from 'classnames/bind';
import styles from './BillShop.module.scss';
import { Image, Button, ConfigProvider } from 'antd';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
    CalendarOutlined,
    EnvironmentOutlined,
    MoneyCollectOutlined,
    SafetyCertificateOutlined,
    WalletOutlined,
    PhoneOutlined,
    UserOutlined,
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

function BillShop({ bill, onCancel, onConfirm, onDelivering, onDelivered, onDone }) {
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
                            <UserOutlined /> Tên khách hàng:
                        </span>{' '}
                        {bill.username}
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
                            <EnvironmentOutlined /> Địa chỉ nhận hàng:
                        </span>{' '}
                        {bill.address}
                    </p>
                    <p>
                        <span style={{ fontWeight: 500 }}>
                            <CalendarOutlined /> Thời gian đặt hàng:
                        </span>{' '}
                        {formattedDate}
                    </p>
                </div>
            </div>
            <div className={cx('action')}>
                <p style={{ display: 'flex', alignItems: 'center' }}>
                    <SafetyCertificateOutlined style={{ marginRight: 3 }} />
                    Tổng cộng:
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
                <div className={cx('list-button')}>
                    {bill.status === 'pending' && (
                        <>
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
                                <Button style={{ marginLeft: 10 }} onClick={() => onConfirm(bill.id_bill)}>
                                    Nhận đơn hàng
                                </Button>
                            </ConfigProvider>

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
                        </>
                    )}
                    {bill.status === 'preparing' && (
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
                            <Button onClick={() => onDelivering(bill.id_bill)}>Giao hàng</Button>
                        </ConfigProvider>
                    )}
                    {bill.status === 'delivering' && (
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
                            <Button onClick={() => onDelivered(bill.id_bill)}>Đã giao hàng</Button>
                        </ConfigProvider>
                    )}

                    {bill.status === 'delivered' && (
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
                            <Button onClick={() => onDone(bill.id_bill)}>Đã hoàn thành</Button>
                        </ConfigProvider>
                    )}
                </div>
            </div>
        </div>
    );
}

BillShop.propTypes = {
    bill: PropTypes.object.isRequired,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    onDelivering: PropTypes.func,
    onDelivered: PropTypes.func,
    onDone: PropTypes.func,
};

export default BillShop;
