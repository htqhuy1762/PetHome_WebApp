import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import logo from '../../../assets/images/logo.png';
import logotitle from '../../../assets/images/logo-title.png';

const cx = classNames.bind(styles);

function Footer() {
    return <footer className={cx('wrapper')}>
        <div className={cx('inner')}>
            <div className={cx('logo-wrapper')}>
                <img className={cx('logo')} src={logo} alt="" />
                <img className={cx('logo-title')} src={logotitle} alt="" />
            </div>
            <p>© 2021 Shopee. All Rights Reserved.</p>
        </div>
    </footer>;
}

export default Footer;
