import classNames from 'classnames/bind';
import styles from './ManagementBill.module.scss';
import * as billServices from '~/services/billServices';
import { useEffect, useState, useRef } from 'react';
import BillShop from '~/components/BillShop';
import { Modal, message, Spin, Empty } from 'antd';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function ListAllBillShop({ isUpdate, setIsUpdate }) {
    const [bills, setBills] = useState([]);
    const [selectedBillId, setSelectedBillId] = useState(null);
    const [isModalVisibleDelivering, setIsModalVisibleDelivering] = useState(false);
    const [isModalVisibleDelivered, setIsModalVisibleDelivered] = useState(false);
    const [isModalVisibleDone, setIsModalVisibleDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [start, setStart] = useState(0);
    const limit = 5; // Số lượng item cần lấy mỗi lần
    const allBillsLoaded = useRef(false);

    const fetchData = async (start) => {
        try {
            setLoading(true);
            const response = await billServices.getShopBills({
                start,
                limit,
                status: "'preparing','delivering','delivered'",
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
    }, [start, isUpdate]);

    const handleDeliveringBill = async () => {
        try {
            const response = await billServices.updateShopBillStatus(selectedBillId, { status: 'delivering' });

            if (response.status === 200) {
                const newBills = bills.map((bill) => 
                    bill.id_bill === selectedBillId ? { ...bill, status: 'delivering' } : bill
                );
                setBills(newBills);
                message.success('Cập nhật đơn hàng thành công');
            } else {
                message.error('Cập nhật đơn hàng thất bại');
            }

            setIsModalVisibleDelivering(false);
            setSelectedBillId(null);
        } catch (error) {
            console.error('Failed to update bill:', error);
            setIsModalVisibleDelivering(false);
            setSelectedBillId(null);
        }
    };

    const handleDeliveredBill = async () => {
        try {
            const response = await billServices.updateShopBillStatus(selectedBillId, { status: 'delivered' });

            if (response.status === 200) {
                const newBills = bills.map((bill) => 
                    bill.id_bill === selectedBillId ? { ...bill, status: 'delivered' } : bill
                );
                setBills(newBills);
                message.success('Cập nhật đơn hàng thành công');
            } else {
                message.error('Cập nhật đơn hàng thất bại');
            }

            setIsModalVisibleDelivered(false);
            setSelectedBillId(null);
        } catch (error) {
            console.error('Failed to update bill:', error);
            setIsModalVisibleDelivered(false);
            setSelectedBillId(null);
        }
    };

    const handleDoneBill = async () => {
        try {
            const response = await billServices.updateShopBillStatus(selectedBillId, { status: 'done' });

            if (response.status === 200) {
                const newBills = bills.filter((bill) => bill.id_bill !== selectedBillId);
                setBills(newBills);
                message.success('Cập nhật đơn hàng thành công');
                setIsUpdate(!isUpdate);
            } else {
                message.error('Cập nhật đơn hàng thất bại');
            }

            setIsModalVisibleDone(false);
            setSelectedBillId(null);
        } catch (error) {
            console.error('Failed to update bill:', error);
            setIsModalVisibleDone(false);
            setSelectedBillId(null);
        }
    };

    const showModalDelivering = (idBill) => {
        setSelectedBillId(idBill);
        setIsModalVisibleDelivering(true);
    };

    const showModalDelivered = (idBill) => {
        setSelectedBillId(idBill);
        setIsModalVisibleDelivered(true);
    };

    const showModalDone = (idBill) => {
        setSelectedBillId(idBill);
        setIsModalVisibleDone(true);
    };

    const handleCancelModalDelivering = () => {
        setIsModalVisibleDelivering(false);
        setSelectedBillId(null);
    };

    const handleCancelModalDelivered = () => {
        setIsModalVisibleDelivered(false);
        setSelectedBillId(null);
    };

    const handleCancelModalDone = () => {
        setIsModalVisibleDone(false);
        setSelectedBillId(null);
    };

    const handleScroll = () => {
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;
        const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

        if (scrolledToBottom && hasMore && !loading && !allBillsLoaded.current) {
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
                <BillShop key={bill.id_bill} bill={bill} onDelivering={showModalDelivering} onDelivered={showModalDelivered} onDone={showModalDone} />
            ))}
            {loading && <Spin className={cx('spin')} />}
            {!loading && !hasMore && bills.length > 0 && (
                <div className={cx('end-message')}>Bạn đã xem hết đơn hàng</div>
            )}
            <Modal
                title="Cập nhật đơn hàng thành đang giao hàng?"
                open={isModalVisibleDelivering}
                onOk={handleDeliveringBill}
                onCancel={handleCancelModalDelivering}
                okText="OK"
                cancelText="Hủy"
            >
                <p>Bạn chắc chắn muốn cập nhật đơn hàng thành đang giao hàng?</p>
            </Modal>
            <Modal
                title="Cập nhật đơn hàng thành đã giao hàng?"
                open={isModalVisibleDelivered}
                onOk={handleDeliveredBill}
                onCancel={handleCancelModalDelivered}
                okText="OK"
                cancelText="Hủy"
            >
                <p>Bạn chắc chắn muốn cập nhật đơn hàng thành đã giao hàng?</p>
            </Modal>

            <Modal
                title="Cập nhật đơn hàng thành đã hoàn thành?"
                open={isModalVisibleDone}
                onOk={handleDoneBill}
                onCancel={handleCancelModalDone}
                okText="OK"
                cancelText="Hủy"
            >
                <p>Bạn chắc chắn muốn cập nhật đơn hàng thành đã hoàn thành?</p>
            </Modal>
        </div>
    );
}

ListAllBillShop.propTypes = {
    isUpdate: PropTypes.bool.isRequired,
    setIsUpdate: PropTypes.func.isRequired,
};

export default ListAllBillShop;