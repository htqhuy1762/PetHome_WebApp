import { useSearchParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './PaymentResult.module.scss';
import { Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function PaymentResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const status = searchParams.get('status');

    const handleBackToBills = () => {
        navigate('/user/purchase'); // Điều hướng về trang danh sách hóa đơn của người dùng
    };

    const handleBackToHome = () => {
        navigate('/'); // Điều hướng về trang danh sách hóa đơn của người dùng
    };

    return (
        <div className={cx('wrapper')}>
            {status === 'success' ? (
                <div className={cx('result')}>
                    <CheckCircleOutlined className={cx('icon', 'success')} />
                    <h2>Thanh toán thành công</h2>
                </div>
            ) : (
                <div className={cx('result')}>
                    <CloseCircleOutlined className={cx('icon', 'error')} />
                    <h2>Thanh toán thất bại</h2>
                </div>
            )}
            <div className={cx('list-btn')}>
                <Button
                    type="primary"
                    style={{ width: 200, height: 40, backgroundColor: 'var(--button-next-color)' }}
                    onClick={handleBackToHome}
                >
                    Quay về trang chủ
                </Button>
                <Button type="primary" style={{ width: 200, height: 40, backgroundColor: 'orange', marginLeft: 20 }} onClick={handleBackToBills}>
                    Quay về danh sách hóa đơn
                </Button>
            </div>
        </div>
    );
}

export default PaymentResult;
