import classNames from 'classnames/bind';
import styles from './Purchase.module.scss';
import * as billServices from '~/services/billServices';
import { useEffect, useState } from 'react';
import Bill from '~/components/Bill';
import { Modal, message, Spin, Empty } from 'antd';

const cx = classNames.bind(styles);

function ListAllBill({ isDone, isCanceled, setIsDone, setIsCanceled }) {
    const [bills, setBills] = useState([]);
    const [selectedBillId, setSelectedBillId] = useState(null);
    const [isModalVisibleCancel, setIsModalVisibleCancel] = useState(false);
    const [isModalVisibleConfirm, setIsModalVisibleConfirm] = useState(false);
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
                status: "'pending','preparing','delivering','delivered'",
            });

            if (response.status === 200) {
                const newData = response.data || [];
                if (newData.length > 0) {
                    if (start === 0) {
                        setBills(newData); // Nếu là lần đầu tiên load (start === 0), thì setBills mới
                    } else {
                        setBills(prevBills => [...prevBills, ...newData]); // Nếu không, thì cộng thêm vào mảng bills cũ
                    }
                    setHasMore(newData.length === limit);
                } else {
                    setHasMore(false);
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
            console.log('selectedBillId', selectedBillId);
            const response = await billServices.updateUserBillStatus(selectedBillId, { status: 'canceled' });
            console.log('response', response);

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

    const handleConfirmBill = async () => {
        try {
            console.log('selectedBillId', selectedBillId);
            const response = await billServices.updateUserBillStatus(selectedBillId, { status: 'done' });
            console.log('response', response);

            if (response.status === 200) {
                const newBills = bills.filter((bill) => bill.id_bill !== selectedBillId);
                setBills(newBills);
                message.success('Cập nhật đơn hàng thành công');
                setIsDone(!isDone);
            } else {
                message.error('Cập nhật đơn hàng thất bại');
            }

            setIsModalVisibleConfirm(false);
            setSelectedBillId(null);
        } catch (error) {
            console.error('Failed to confirm bill:', error);
            setIsModalVisibleConfirm(false);
            setSelectedBillId(null);
        }
    };

    const showModalCancel = (idBill) => {
        setSelectedBillId(idBill);
        setIsModalVisibleCancel(true);
    };

    const showModalConfirm = (idBill) => {
        setSelectedBillId(idBill);
        setIsModalVisibleConfirm(true);
    };

    const handleCancelModalCancel = () => {
        setIsModalVisibleCancel(false);
        setSelectedBillId(null);
    };

    const handleCancelModalConfirm = () => {
        setIsModalVisibleConfirm(false);
        setSelectedBillId(null);
    };

    const handleScroll = () => {
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;
        const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

        if (scrolledToBottom && hasMore && !loading) {
            setStart(prevStart => prevStart + limit);
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
                <Bill key={bill.id_bill} bill={bill} onCancel={showModalCancel} onConfirm={showModalConfirm} />
            ))}
            {loading && <Spin className={cx('spin')} />}
            {!loading && !hasMore && bills.length > 0 && (
                <div className={cx('end-message')}>Bạn đã xem hết đơn hàng</div>
            )}
            <Modal
                title="Xác nhận đã nhận được hàng?"
                open={isModalVisibleConfirm}
                onOk={handleConfirmBill}
                onCancel={handleCancelModalConfirm}
                okText="OK"
                cancelText="Hủy"
            >
                <p>Bạn đã chắc chắn nhận được hàng rồi?</p>
            </Modal>
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

export default ListAllBill;