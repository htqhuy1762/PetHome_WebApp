import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import logo from '../../../assets/images/logo.png';
import logotitle from '../../../assets/images/logo-title.png';
import { Input, Badge, Button } from 'antd';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function Header() {
    const onSearch = (value, _e, info) => console.log(info?.source, value);

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('logo-wrapper')}>
                    <img className={cx('logo')} src={logo} alt="" />
                    <img className={cx('logo-title')} src={logotitle} alt="" />
                </div>

                <div className={cx('search-container')}>
                    <Input.Search
                        size="large"
                        placeholder="Tìm thú cưng, vật phẩm, dịch vụ, ..."
                        onSearch={onSearch}
                        enterButton
                        allowClear
                    />
                </div>
                <div className={cx('right-menu')}>
                    <div className={cx('cart')}>
                        <Badge count={5}>
                            <Button className={cx('cart-btn')} size="large" shape="circle" icon={<ShoppingCartOutlined />} />
                        </Badge>
                    </div>
                    <div className={cx('user')}>
                        <Button className={cx('user-btn')} size="large" shape="circle" icon={<UserOutlined />} />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
