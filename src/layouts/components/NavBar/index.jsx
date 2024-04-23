import classNames from 'classnames/bind';
import styles from './Navbar.module.scss';
import { Menu } from 'antd';

const cx = classNames.bind(styles);

function Navbar() {
    return (
        <div className={cx('wrapper')}>
            <Menu mode="horizontal">
                <Menu.Item key="home">Thú cưng</Menu.Item>
                <Menu.Item key="items">Vật phẩm</Menu.Item>
                <Menu.Item key="services">Dịch vụ</Menu.Item>
                <Menu.Item key="blog">Blog</Menu.Item>
            </Menu>
        </div>
    );
}

export default Navbar;
