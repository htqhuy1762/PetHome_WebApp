import styles from './Login.module.scss';
import classNames from 'classnames/bind';
import logo from '~/assets/images/logo.png';
import logotitle from '~/assets/images/logo-title.png';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import * as authServices from '~/services/authServices';
import * as shopServices from '~/services/shopServices';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '~/context/AuthProvider/index.jsx';
import { useEffect, useContext, useRef } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { LoginSocialFacebook } from 'reactjs-social-login';
import { createButton } from 'react-social-login-buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);

const config = {
    text: 'Đăng nhập bằng Facebook',
    icon: () => <FontAwesomeIcon style={{ color: '#0866ff', fontSize: '20px', paddingRight: 0 }} icon={faFacebook} />,
    style: {
        background: 'white',
        padding: '0 8px',
        color: '#3c4043',
        fontSize: '14px',
        fontWeight: '500',
        fontFamily: '"Google Sans",arial,sans-serif',
        height: '40px',
        margin: '1px 0 0 5px',
        boxShadow: 'none',
        borderRadius: '4px',
        border: '1px solid #dadce0',
        width: '227px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
    },
    activeStyle: { background: 'white' },
};

function Login() {
    const MyFacebookLoginButton = createButton(config);
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const formRef = useRef(null);

    const onFinish = async (data) => {
        try {
            const response = await authServices.login(data);

            if (response && response.status === 200) {
                const accessToken = response.data.accessToken;
                const expiredAt = response.data.expiredAt;
                const refreshToken = response.data.refreshToken;

                // Save accessToken to localStorage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('expiredAt', expiredAt);
                localStorage.setItem('refreshToken', refreshToken);

                setIsLoggedIn(true);

                const responseIsRegister = await shopServices.checkIsRegisterShop();
                const responseIsActive = await shopServices.checkIsActiveShop();

                if (responseIsRegister.status === 200 || responseIsRegister.status === 201) {
                    if (responseIsRegister.data.message === 'User is shop owner') {
                        localStorage.setItem('idShop', responseIsActive.data.id_shop);
                    }
                }

                navigate('/');
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Vui lòng kiểm tra lại email hoặc mật khẩu!',
                });
                return;
            }
        } catch (error) {
            console.log('login failed:', error);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/'); // Đường dẫn đến trang chủ của bạn
        }
    }, [isLoggedIn, navigate]);

    const handleForgotPassword = async () => {
        const email = formRef.current.getFieldValue('email');
        if (!email) {
            notification.error({
                message: 'Error',
                description: 'Vui lòng nhập email của bạn!',
            });
            return;
        }

        try {
            const response = await authServices.sendCodeResetPassword({ email: email });
            if (response.status === 200) {
                localStorage.setItem('resetToken', response.data.token);
                localStorage.setItem('resetTokenExpired', response.data.expiredAt);
                localStorage.setItem('resetEmail', email);
                navigate('/forgotpassword');
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Email này chưa được đăng ký!',
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Có lỗi xảy ra, vui lòng thử lại!',
            });
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const credentialResponseDecode = jwtDecode(credentialResponse.credential);
            const data = {
                email: credentialResponseDecode.email,
                name: credentialResponseDecode.name,
            };

            const response = await authServices.googleLogin(data);
            if (response.status === 200) {
                const accessToken = response.data.accessToken;
                const expiredAt = response.data.expiredAt;
                const refreshToken = response.data.refreshToken;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('expiredAt', expiredAt);
                localStorage.setItem('refreshToken', refreshToken);

                setIsLoggedIn(true);

                const responseIsRegister = await shopServices.checkIsRegisterShop();
                const responseIsActive = await shopServices.checkIsActiveShop();

                if (responseIsRegister.status === 200 || responseIsRegister.status === 201) {
                    if (responseIsRegister.data.message === 'User is shop owner') {
                        localStorage.setItem('idShop', responseIsActive.data.id_shop);
                    }
                }

                navigate('/');
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Đăng nhập không thành công!',
                });
            }
        } catch (error) {
            console.error('Đăng nhập bằng Google không thành công:', error);
        }
    };

    const handleFacebookLogin = async (facebookResponse) => {
        try {
            const data = {
                email: facebookResponse.data.email,
                name: facebookResponse.data.name,
                facebook_id: facebookResponse.data.id,
            };

            const response = await authServices.facebookLogin(data);
            if (response.status === 200) {
                const accessToken = response.data.accessToken;
                const expiredAt = response.data.expiredAt;
                const refreshToken = response.data.refreshToken;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('expiredAt', expiredAt);
                localStorage.setItem('refreshToken', refreshToken);

                setIsLoggedIn(true);

                const responseIsRegister = await shopServices.checkIsRegisterShop();
                const responseIsActive = await shopServices.checkIsActiveShop();

                if (responseIsRegister.status === 200 || responseIsRegister.status === 201) {
                    if (responseIsRegister.data.message === 'User is shop owner') {
                        localStorage.setItem('idShop', responseIsActive.data.id_shop);
                    }
                }

                navigate('/');
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Đăng nhập không thành công!',
                });
            }
        } catch (error) {
            console.error('Đăng nhập bằng Facebook không thành công:', error);
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
                    ref={formRef}
                >
                    <h1 style={{ textAlign: 'center', fontSize: '5rem' }}>Đăng nhập</h1>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Tài khoản</label>}
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]}
                    >
                        <Input size="large" prefix={<UserOutlined />} placeholder="Email" autoComplete="username" />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Mật khẩu</label>}
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu"
                            autoComplete="current-password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <a
                            style={{ fontSize: '1.6rem' }}
                            className={cx('forgot_password')}
                            onClick={handleForgotPassword}
                        >
                            Quên mật khẩu
                        </a>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            style={{ backgroundColor: 'var(--button-next-color)', width: '100%', fontSize: '1.7rem' }}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <div style={{ textAlign: 'center', fontSize: '1.6rem' }}>Hoặc đăng nhập bằng:</div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                            <GoogleLogin
                                style={{ width: '230px' }}
                                onSuccess={handleGoogleLogin}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                            />
                            <LoginSocialFacebook
                                style={{ width: '50%' }}
                                appId={import.meta.env.VITE_APP_APP_ID_FACEBOOK}
                                onResolve={(response) => {
                                    handleFacebookLogin(response);
                                }}
                                onReject={(error) => {
                                    console.log(error);
                                }}
                            >
                                <MyFacebookLoginButton />
                            </LoginSocialFacebook>
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
