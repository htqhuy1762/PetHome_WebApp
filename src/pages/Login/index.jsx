import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import logo from '../../assets/images/logo.png';
import logotitle from '../../assets/images/logo-title.png';
import google_logo from '../../assets/images/Google_Logo.png';
import facebook_logo from '../../assets/images/Facebook_Logo.png';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import * as authServices from '~/services/authServices'; 

const cx = classNames.bind(styles);

function Login() {
    const onFinish = async (data) => {
        try {
            const response = await authServices.login(data);
            console.log('login successfully:', response);
        }
        catch(error) {
            console.log('login failed:', error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('logo_container')}>
                <img className={cx('logo')} src={logo} alt="logo" />
                <img className={cx('logo_title')} src={logotitle} alt="logotitle" />
            </div>

            <div className={cx('form_container')}>
                <Form
                    className={cx('form')}
                    name="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <h1 style={{ textAlign: 'center', fontSize: '5rem' }}>Đăng nhập</h1>
                    <Form.Item
                        label={<label style={{fontSize: '1.6rem'}}>Tài khoản</label>}
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]}
                    >
                        <Input size="large" prefix={<UserOutlined />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{fontSize: '1.6rem'}}>Mật khẩu</label>}
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
                    >
                        <Input.Password size="large" prefix={<LockOutlined />} placeholder="Mật khẩu" />
                    </Form.Item>
                    <Form.Item>
                        <a style={{fontSize: '1.6rem'}} className={cx('forgot_password')} href="/forgot-password">
                            Quên mật khẩu
                        </a>
                    </Form.Item>
                    <Form.Item>
                        <Button size="large" type="primary" htmlType="submit" style={{ backgroundColor: 'var(--button-color)', width: '100%', fontSize: '1.7rem' }}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <div style={{ textAlign: 'center', fontSize: '1.6rem' }}>Hoặc đăng nhập bằng:</div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <Button
                                className={cx('ortherLogin')}
                                size="large"
                                icon={
                                    <img
                                        src={google_logo}
                                        alt="Google"
                                        style={{ height: '2.5rem', marginRight: '10px'}}
                                    />
                                }
                                style={{ marginRight: '10px' , fontSize: '1.7rem'}}
                            >
                                Google
                            </Button>
                            <Button
                                className={cx('ortherLogin')}
                                size="large"
                                icon={
                                    <img
                                        src={facebook_logo}
                                        alt="Google"
                                        style={{ height: '2.5rem', marginRight: '10px'}}
                                    />
                                }
                                style={{ fontSize: '1.7rem'}}
                            >
                                Facebook
                            </Button>
                        </div>
                    </Form.Item>
                    <Form.Item>
                        <div style={{ textAlign: 'center', fontSize: '1.6rem' }}>
                            Nếu chưa có tài khoản, <a href="/register">đăng ký ngay</a>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Login;
