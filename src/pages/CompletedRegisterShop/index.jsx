import classNames from "classnames/bind";
import { Button, ConfigProvider } from "antd";
import styles from "./CompletedRegisterShop.module.scss";
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function CompletedRegisterShop() {
    const navigate = useNavigate();

    const handleGoToHome = () => {
        navigate('/');
    };

    return (
        <div className={cx('wrapper')}>
            <h1 style={{ textAlign: 'center', paddingBottom: '15px' }}>Hoàn thành!</h1>
            <div className={cx('content')}>
                <p style={{ textAlign: 'center', fontSize: '1.6rem' }}>
                    Bạn đã hoàn thành thủ tục để đăng ký cửa hàng. <br />
                    Chúng tôi sẽ kiểm duyệt trong thời gian sớm nhất (thời gian chậm nhất là 1 tuần).
                    <br /> Pet Home chân thành cảm ơn!
                </p>
                <div className={cx('button-container')} style={{ justifyContent: 'center', width: '100%' }}>
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
                        <Button className={cx('btn-next')} type="default" onClick={handleGoToHome} >
                            Đi đến trang chủ của bạn!
                        </Button>
                    </ConfigProvider>
                </div>
            </div>
        </div>
    );
}

export default CompletedRegisterShop;