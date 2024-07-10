import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './ShopManagementLayout.module.scss';
import Header from '~/layouts/components/Header';
import Footer from '~/layouts/components/Footer';
import SidebarShopManagement from '~/layouts/components/SidebarShopManagement';

const cx = classNames.bind(styles);

function ShopManagementLayout({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header fixedHeader={false} />
            <div className={cx('container')}>
                <div className={cx('header')}>
                    <h1 style={{ marginTop: 0, color: 'var(--button-next-color)' }}>Quản lý cửa hàng</h1>
                </div>
                <div className={cx('content')}>
                    <SidebarShopManagement />
                    <div className={cx('page')}>{children}</div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

ShopManagementLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ShopManagementLayout;
