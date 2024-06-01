import classNames from 'classnames/bind';
import styles from './ShopManagement.module.scss';

const cx = classNames.bind(styles);

function ShopManagement() {
    return (
        <div className={cx('wrapper')}>
            <h2>Shop Management</h2>
        </div>
    );
}

export default ShopManagement;
