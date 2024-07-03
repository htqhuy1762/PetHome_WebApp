import classNames from 'classnames/bind';
import styles from './Purchase.module.scss';
import * as billServices from '~/services/billServices';
import { useEffect, useState, useRef } from 'react';
import Bill from '~/components/Bill';
import { Empty, Spin } from 'antd';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function ListDoneBill({ isDone }) {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [start, setStart] = useState(0);
    const limit = 5; // Số lượng item cần lấy mỗi lần
    const allBillsLoaded = useRef(false);

    const fetchData = async (start) => {
        try {
            setLoading(true);
            const response = await billServices.getUserBills({
                start,
                limit,
                status: "'done'",
                payment_status: "'pending','paid'",
            });

            if (response.status === 200) {
                const newData = response.data || [];
                if (newData.length > 0) {
                    if (start === 0) {
                        setBills(newData); // Nếu là lần đầu tiên load (start === 0), thì setBills mới
                    } else {
                        setBills((prevBills) => [...prevBills, ...newData]); // Nếu không, thì cộng thêm vào mảng bills cũ
                    }
                    setHasMore(newData.length === limit);
                } else {
                    setHasMore(false);
                    allBillsLoaded.current = true;
                }
            }
        } catch (error) {
            console.error('Failed to fetch bills:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(start);
    }, [start, isDone]);

    const handleScroll = () => {
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        const scrollHeight =
            (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;
        const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

        if (scrolledToBottom && hasMore && !loading && !allBillsLoaded.current) {
            setStart((prevStart) => prevStart + limit);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (bills.length === 0 && !loading) {
        return (
            <div className={cx('wrapper')}>
                <Empty description="Danh sách đơn hàng trống" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            {bills.map((bill) => (
                <Bill key={bill.id_bill} bill={bill} />
            ))}
            {loading && <Spin className={cx('spin')} />}
            {!loading && !hasMore && <div className={cx('end-message')}>Bạn đã xem hết danh sách đơn hàng</div>}
        </div>
    );
}

ListDoneBill.propTypes = {
    isDone: PropTypes.bool,
};

export default ListDoneBill;
