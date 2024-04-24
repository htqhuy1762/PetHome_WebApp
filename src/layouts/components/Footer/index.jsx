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
                    <div className={cx('logo-wrapper')}>
                        <img className={cx('logo')} src={logo} alt="" />
                        <img className={cx('logo-title')} src={logotitle} alt="" />
                    </div>
                    <p>Download the app by clicking the link below:</p>
                    <Button
                        className={cx('ggplayicon')}
                        icon={<img style={{ height: '80px', width: '208px' }} src={googlePlayIcon}></img>}
                    />
                </div>

                <div className={cx('element2')}>
                    <div className={cx('title2')}>
                        <p style={{fontWeight: 'bold', fontSize: '3rem', marginLeft: '15px'}}>Đồ án tốt nghiệp</p>
                    </div>
                    <div className={cx('listsv')}>
                        <p>Lê Xuân Huy</p>
                        <p>Huỳnh Trần Quang Huy</p>
                        <p>Trần Hân Du</p>
                        <p>Huỳnh Minh Tú</p>
                        <p style={{fontWeight: 'bold'}}>GVHD: Ths. Nguyễn Lê Hoàng Dũng</p>
                    </div>
                    <p>© Copyright University of Science - VNUHCM, All rights reserved</p>
                </div>

                <div className={cx('element3')}>
                    <div className={cx('title3')}>
                        <p style={{fontWeight: 'bold', fontSize: '3rem'}}>Social media</p>
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
