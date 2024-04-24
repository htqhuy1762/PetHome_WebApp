import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Navbar.module.scss';
import { Menu } from 'antd';

const cx = classNames.bind(styles);

function Navbar() {
    return (
        <div className={cx('wrapper')}>
            <Menu mode="horizontal" className={cx('menu')} defaultSelectedKeys={['home']}>
                <Menu.Item key="home" className={cx('menu-item')}>
                    <Link to="/">Thú cưng</Link>
                </Menu.Item>
                <Menu.Item key="items" className={cx('menu-item')}>
                    <Link to="/items">Vật phẩm</Link>
                </Menu.Item>
                <Menu.Item key="services" className={cx('menu-item')}>
                    <Link to="/services">Dịch vụ</Link>
                </Menu.Item>
                <Menu.Item key="blog" className={cx('menu-item')}>
                    <Link to="/blogs">Blog</Link>
                </Menu.Item>
            </Menu>
        </div>
    );
}

export default Navbar;