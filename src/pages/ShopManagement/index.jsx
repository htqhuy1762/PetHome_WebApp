import classNames from 'classnames/bind';
import styles from './ShopManagement.module.scss';

const cx = classNames.bind(styles);

function ShopManagement() {
    return <div className={cx('wrapper')}></div>;
}

export default ShopManagement;
