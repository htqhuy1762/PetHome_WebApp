import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import logo from '../../../assets/images/logo.png';
import logotitle from '../../../assets/images/logo-title.png';
import { Button } from 'antd';
import googlePlayIcon from '~/assets/images/GooglePlay.png';
import { FacebookFilled, YoutubeFilled, LinkedinFilled, InstagramFilled } from '@ant-design/icons';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('element1')}>
                    <a href="/">
                        <div className={cx('logo-wrapper')}>
                            <img className={cx('logo')} src={logo} alt="" />
                            <img className={cx('logo-title')} src={logotitle} alt="" />
                        </div>
                    </a>
                    <p>Tải xuống ứng dụng bằng cách nhấp vào liên kết bên dưới:</p>
                    <Button
                        className={cx('ggplayicon')}
                        icon={<img style={{ height: '80px', width: '208px' }} src={googlePlayIcon}></img>}
                    />
                </div>

                <div className={cx('element2')}>
                    <p style={{ color: 'rgba(0, 0, 0, .54)' }}>
                        © Copyright University of Science - VNUHCM, All rights reserved
                    </p>
                </div>

                <div className={cx('element3')}>
                    <div className={cx('title3')}>
                        <p style={{ fontWeight: 'bold', fontSize: '3rem' }}>Truyền thông xã hội</p>
                    </div>
                    <div className={cx('social-icons')}>
                        <FacebookFilled />
                        <YoutubeFilled />
                        <LinkedinFilled />
                        <InstagramFilled />
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
