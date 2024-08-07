import classNames from 'classnames/bind';
import styles from './Purchase.module.scss';
import * as billServices from '~/services/billServices';
import * as paymentServices from '~/services/paymentServices';
import { useEffect, useState, useRef } from 'react';
import Bill from '~/components/Bill';
import { Modal, message, Spin, Empty } from 'antd';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function ListNewBill({ isCanceled, setIsCanceled }) {
    const [bills, setBills] = useState([]);
    const allBillsLoaded = useRef(false);
    const [selectedBillId, setSelectedBillId] = useState(null);
    const [isModalVisibleCancel, setIsModalVisibleCancel] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [start, setStart] = useState(0);
    const limit = 5; // Số lượng item cần lấy mỗi lần

    const fetchData = async (start) => {
        try {
            setLoading(true);
            const response = await billServices.getUserBills({
                start,
                limit,
                status: "'pending'",
                payment_status: "'paid', 'pending'",
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
    }, [start]);

    const handleCancelBill = async () => {
        try {
            const response = await billServices.updateUserBillStatus(selectedBillId, { status: 'canceled' });

            if (response.status === 200) {
                const newBills = bills.filter((bill) => bill.id_bill !== selectedBillId);
                setBills(newBills);
                message.success('Hủy đơn hàng thành công');
                setIsCanceled(!isCanceled);
            } else {
                message.error('Hủy đơn hàng thất bại');
            }

            setIsModalVisibleCancel(false);
            setSelectedBillId(null);
        } catch (error) {
            console.error('Failed to cancel bill:', error);
            setIsModalVisibleCancel(false);
            setSelectedBillId(null);
        }
    };

    const handlePaymentVNPAY = async (idBill) => {
        try {
            const response = await paymentServices.createUrlVNPay(idBill);

            if (response.status === 200) {
                const paymentUrl = response.data.vnpay_redirect_url;
                window.location.href = paymentUrl;
            } else {
                message.error('Thanh toán thất bại');
            }
            setSelectedBillId(null);
        } catch (error) {
            console.error('Failed to cancel bill:', error);
            setSelectedBillId(null);
        }
    };

    const showModalCancel = (idBill) => {
        setSelectedBillId(idBill);
        setIsModalVisibleCancel(true);
    };

    const handleCancelModalCancel = () => {
        setIsModalVisibleCancel(false);
        setSelectedBillId(null);
    };

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
                <Bill
                    key={bill.id_bill}
                    bill={bill}
                    onCancel={showModalCancel}
                    onPayment={handlePaymentVNPAY}
                />
            ))}
            {loading && <Spin className={cx('spin')} />}
            {!loading && !hasMore && bills.length > 0 && (
                <div className={cx('end-message')}>Bạn đã xem hết đơn hàng</div>
            )}
            <Modal
                title="Xác nhận hủy đơn hàng?"
                open={isModalVisibleCancel}
                onOk={handleCancelBill}
                onCancel={handleCancelModalCancel}
                okText="OK"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
            </Modal>
        </div>
    );
}

ListNewBill.propTypes = {
    isCanceled: PropTypes.bool,
    setIsCanceled: PropTypes.func,
};

export default ListNewBill;
