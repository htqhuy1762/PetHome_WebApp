import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import logo from '../../../assets/images/logo.png'
import logotitle from '../../../assets/images/logo-title.png'
import { Input, Badge, Button } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function Header() {
    return <header className={cx('wrapper')}>
        <div className={cx('inner')}>
            <div className={cx('logo-wrapper')}>
                <img className={cx('logo')} src={logo} alt="" />
                <img className={cx('logo-title')} src={logotitle} alt="" />
            </div>
            
            <div className="search-bar">
                <Input.Search placeholder="Search products..." enterButton />
            </div>
            <div className="right-menu">
                <Badge count={5}>
                    <Button shape="circle" icon={<ShoppingCartOutlined />} />
                </Badge>
                <Button shape="circle" icon={<UserOutlined />} />
            </div>
        </div>
    </header>;
}

export default Header;