import classNames from 'classnames/bind';
import styles from './ShopManagement.module.scss';

const cx = classNames.bind(styles);

function ShopManagement() {
    return (
        <div className={cx('wrapper')}>
            <h1> Chào mừng bạn đến với Pet Home - Kênh quản lý cửa hàng </h1>
            <p>
                Pet Home - Kênh quản lý cửa hàng là công cụ quản lý shop giúp bạn dễ dàng quản lý các sản phẩm, theo dõi
                đơn hàng, chăm sóc khách hàng và đánh giá hoạt động của shop. Vui lòng bấm chọn vào các mục menu bên
                trái để sử dụng công cụ, cảm ơn!
            </p>
        </div>
    );
}

export default ShopManagement;
