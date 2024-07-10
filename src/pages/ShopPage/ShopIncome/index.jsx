import classNames from 'classnames/bind';
import styles from './ShopIncome.module.scss';
import { DatePicker, Empty, Button, ConfigProvider, Row, Col } from 'antd';
import { useState } from 'react';
import BillShop from '~/components/BillShop';
import * as shopServices from '~/services/shopServices';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const cx = classNames.bind(styles);

function ShopIncome() {
    const [bills, setBills] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [dates, setDates] = useState([]);

    const handleDateChange = (dates) => {
        setDates(dates);
    };

    const fetchBills = async () => {
        if (dates.length === 2) {
            const [startDate, endDate] = dates;
            const from = dayjs.utc(startDate).utcOffset(7).format('YYYY-MM-DD');
            const to = dayjs.utc(endDate).utcOffset(7).format('YYYY-MM-DD');
            try {
                const response = await shopServices.getShopIncomes(from, to);
                setBills(response.data.bills || []);
                setTotalIncome(response.data.total || 0);
            } catch (error) {
                console.error('Failed to fetch bills', error);
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>
                <h1>Quản lý doanh thu</h1>
            </div>
            <div className={cx('content')}>
                <div className={cx('header')}>
                    <DatePicker.RangePicker format="DD-MM-YYYY" size="large" onChange={handleDateChange} />
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
                        <Button style={{ marginLeft: '15px' }} size="large" onClick={fetchBills}>
                            Tra cứu
                        </Button>
                    </ConfigProvider>
                </div>
                <div className="list-bill">
                    {bills.length > 0 ? (
                        <div>
                            {bills.map((bill) => (
                                <BillShop key={bill.id_bill} bill={bill} />
                            ))}
                        </div>
                    ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />
                    )}
                </div>
                <Row className={cx('cal-all')}>
                    <Col span={4} style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ fontSize: '1.7rem' }}>Tổng doanh thu:</p>
                    </Col>
                    <Col span={5} style={{ display: 'flex', alignItems: 'center' }}>
                        <Row style={{ display: 'flex', justifyContent: 'center' }}>
                            <p style={{ fontSize: '3rem', color: 'var(--button-next-color)', fontWeight: '700' }}>
                                {totalIncome.toLocaleString('it-IT')} đ
                            </p>
                        </Row>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default ShopIncome;
