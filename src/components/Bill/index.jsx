import classNames from 'classnames/bind';
import styles from './Bill.module.scss';
import { Image, Button, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
    CalendarFilled,
    EnvironmentFilled,
    MoneyCollectFilled,
    SafetyCertificateFilled,
    ShopFilled,
} from '@ant-design/icons';

dayjs.extend(utc);

const cx = classNames.bind(styles);

const statusMap = {
    pending: 'Đang chờ xác nhận',
    preparing: 'Đang chuẩn bị',
    delivering: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    done: 'Đã nhận hàng',
    canceled: 'Hủy đơn',
};

function Bill({ bill, onCancel, onConfirm }) {
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
                    <ShopFilled /> {bill.shop_name}
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
                            <MoneyCollectFilled />
                            Giá:
                        </span>{' '}
                        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                            {bill.price.toLocaleString('vi-VN')}đ
                        </span>
                    </p>
                    <p>
                        <span style={{ fontWeight: 500 }}>
                            <CalendarFilled />
                            Thời gian đặt hàng:
                        </span>{' '}
                        {formattedDate}
                    </p>

                    <p>
                        <span style={{ fontWeight: 500 }}>
                            <EnvironmentFilled />
                            Địa chỉ nhận hàng:
                        </span>{' '}
                        {bill.address}
                    </p>
                </div>
            </div>
            <div className={cx('action')}>
                <p style={{ display: 'flex', alignItems: 'center' }}>
                    <SafetyCertificateFilled />
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
                            <Button onClick={() => onConfirm(bill.id_bill)}>Đã nhận được hàng</Button>
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

export default Bill;
