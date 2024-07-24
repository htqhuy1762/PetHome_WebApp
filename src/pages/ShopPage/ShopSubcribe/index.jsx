import classNames from 'classnames/bind';
import styles from './ShopSubcribe.module.scss';
import { Image, Button, ConfigProvider } from 'antd';
import shopSubcribe from '~/assets/images/shop_subcribe.png';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function ShopSubcribe() {
    return (
        <div className={cx('wrapper')}>
            <h1>Bắt đầu bán hàng với PetHome</h1>
            <div className={cx('image-container')}>
                <Image preview={false} width={500} height={500} src={shopSubcribe} />
            </div>
            <div className={cx('sign-container')}>
                <ConfigProvider
                    theme={{
                        components: {
                            Button: {
                                defaultColor: 'white',
                                defaultBg: 'var(--button-next-color)',
                                defaultBorderColor: 'var(--button-next-color)',
                                defaultHoverBorderColor: 'var(--button-next-color)',
                                defaultHoverBg: 'var(--button-next-color)',
                                defaultHoverColor: 'white',
                            },
                        },
                    }}
                >
                    <Button size="large" className={cx('sign-btn')}>
                        <Link to="/user/shop/register">Đăng ký ngay</Link>
                    </Button>
                </ConfigProvider>
                <p style={{ textAlign: 'center', marginTop: '20px' }}>
                    Đăng ký ngay để bắt đầu bán hàng trên PetHome. Chúng tôi sẽ giúp bạn tạo cửa hàng trực tuyến của
                    mình một cách dễ dàng và nhanh chóng.
                </p>
            </div>
        </div>
    );
}

export default ShopSubcribe;
