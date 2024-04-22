import classNames from 'classnames/bind';
import styles from './Navbar.module.scss';
import { Menu } from 'antd';

const cx = classNames.bind(styles);

function Navbar() {
    return (
        <Menu mode="horizontal">
            <Menu.Item key="home">Pet</Menu.Item>
            <Menu.Item key="items">Items</Menu.Item>
            <Menu.Item key="services">Services</Menu.Item>
            <Menu.Item key="pethome">PetHome</Menu.Item>
        </Menu>
    );
}

export default Navbar;
