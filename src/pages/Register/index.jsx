import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import styles from './Register.module.scss';
import classNames from 'classnames/bind';
import logo from '../../assets/images/logo.png';
import logotitle from '../../assets/images/logo-title.png';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined, LeftOutlined } from '@ant-design/icons';
import { sendCodeEmail, verifyCodeEmail, register } from '../../services/authServices';

const cx = classNames.bind(styles);

function InputEmail({ onNext, setToken, setExpiry, setEmail }) {
    const navigate = useNavigate();
    const onBack = () => {
        navigate('/login');
    };
    const [form] = Form.useForm();

    const handleClick = async () => {
        try {
            // Get the email value from the form
            const values = form.getFieldsValue();
            const email = values.email;

            // Check if the email is valid
            if (!email || !form.getFieldError('email').length) {
                const response = await sendCodeEmail({ email });

                if (response.status === 208) {
                    //console.log('Email already exists');
                    notification.warning({
                        message: 'Warning',
                        description: 'Email already exists',
                    });
                    return;
                }

                setToken(response.data.token);
                setExpiry(response.data.expiredAt);
                setEmail(email);

                onNext();
            } else {
                //console.log('Invalid email');
                notification.error({
                    message: 'Error',
                    description: 'Invalid email',
                });
            }
        } catch (error) {
            console.log('send code failed:', error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('logo_container')}>
                <img className={cx('logo')} src={logo} alt="logo" />
                <img className={cx('logo_title')} src={logotitle} alt="logotitle" />
            </div>

            <div className={cx('form_container')}>
                <Button className={cx('back_button')} type="text" onClick={() => onBack()}>
                    <LeftOutlined />
                </Button>
                <Form
                    form={form}
                    className={cx('form')}
                    name="input-email-form"
                    initialValues={{ remember: true }}
                    layout="vertical"
                >
                    <h1 style={{ textAlign: 'center', fontSize: '5rem', marginBottom: '10px' }}>Nhập email</h1>
                    <h3 style={{ textAlign: 'center', fontSize: '1.5rem', color: 'gray', marginBottom: '30px'}}>
                        Thêm email của bạn. Chúng tôi sẽ gửi cho bạn mã xác minh để chúng tôi biết bạn là thật. Chúng
                        tôi sẽ sử dụng email này làm tên đăng nhập cho tài khoản của bạn
                    </h3>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Email</label>}
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email của bạn!' },
                            { type: 'email', message: 'Email không hợp lệ!' },
                        ]}
                    >
                        <Input size="large" prefix={<UserOutlined />} placeholder="Nhập Email" />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            size="large"
                            type="primary"
                            style={{ backgroundColor: 'var(--button-color)', width: '100%', fontSize: '1.7rem' }}
                            onClick={handleClick}
                            disabled={
                                form.getFieldsError().filter(({ errors }) => errors.length).length ||
                                form.getFieldError('email').length > 0
                            }
                        >
                            Gửi mã OTP
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

function InputOTP({ onNext, onBack, token, expiry, email, setToken, setExpiry }) {
    const [otp, setOtp] = useState('');
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [form] = Form.useForm();

    const verifyOTP = async () => {
        try {
            const isTokenExpired = new Date() > new Date(expiry);
            if (isTokenExpired) {
                return;
            }

            const response = await verifyCodeEmail({ code: otp }, token);
            if (response.status === 401) {
                //console.log(response.data.error);
                notification.error({
                    message: 'Error',
                    description: response.data.error,
                });
                return;
            }
            onNext(response);
        } catch (error) {
            console.log('OTP verification failed:', error);
        }
    };

    const resendOTP = async () => {
        if (!resendDisabled) {
            const response = await sendCodeEmail({ email });
            setToken(response.data.token);
            setExpiry(response.data.expiredAt);

            // Bắt đầu đếm ngược
            setResendDisabled(true);
            setCountdown(60);
        }
    };

    useEffect(() => {
        if (resendDisabled && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);

            // Dọn dẹp khi unmount
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setResendDisabled(false);
        }
    }, [resendDisabled, countdown]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('logo_container')}>
                <img className={cx('logo')} src={logo} alt="logo" />
                <img className={cx('logo_title')} src={logotitle} alt="logotitle" />
            </div>

            <div className={cx('form_container')}>
                <Button className={cx('back_button')} type="text" onClick={() => onBack()}>
                    <LeftOutlined />
                </Button>
                <Form
                    form={form}
                    className={cx('form')}
                    name="input-otp-form"
                    initialValues={{ remember: true }}
                    layout="vertical"
                >
                    <h1 style={{ textAlign: 'center', fontSize: '5rem', marginBottom: '10px' }}>Nhập mã OTP</h1>
                    <h3 style={{ textAlign: 'center', fontSize: '1.5rem', color: 'gray', marginBottom: '30px'}}>
                        Nhập mã OTP được gửi đến email của bạn
                    </h3>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Mã OTP</label>}
                        name="otp"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mã OTP!' },
                            { len: 6, message: 'Mã OTP phải có 6 số!' },
                        ]}
                    >
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            inputType="tel"
                            renderInput={(props, index) => (
                                <input
                                    key={index}
                                    {...props}
                                    style={{
                                        width: '4rem',
                                        height: '4rem',
                                        fontSize: '2rem',
                                        margin: '0 1.3rem',
                                        borderRadius: '10px',
                                        border: '1px solid #ccc',
                                        textAlign: 'center',
                                    }}
                                />
                            )}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            size="large"
                            type="primary"
                            style={{ backgroundColor: 'var(--button-color)', width: '100%', fontSize: '1.7rem' }}
                            onClick={verifyOTP}
                            disabled={otp.length !== 6}
                        >
                            Tiếp tục
                        </Button>
                    </Form.Item>
                    <h3 style={{ textAlign: 'center', fontSize: '1.5rem', color: 'gray'}}>
                        Bạn không nhận được mã OTP?
                    </h3>
                    <Form.Item style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                        <Button
                            style={{ fontWeight: '650', display: 'flex', alignItems: 'center', color: resendDisabled ? 'gray' : 'var(--button-color)', fontSize: '1.7rem' }}
                            type="text"
                            disabled={resendDisabled}
                            onClick={resendOTP}
                        >
                            {resendDisabled ? `Gửi lại mã OTP trong (${countdown} s)` : 'Gửi lại mã OTP'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

function RegisterForm({ onBack, email }) {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const response = await register({ name: values.username, email: email, password: values.password });
            if (response.status === 201) {
                // console.log('Register successful');
                notification.success({
                    message: 'Success',
                    description: 'Đăng ký tài khoản thành công!',
                });
                navigate('/login');
            } else {
                //console.log('Register failed:', response.data.error);
                notification.error({
                    message: 'Error',
                    description: response.data.error,
                });
            }
        } catch (error) {
            console.log('Register failed:', error);
        }
    };
    const [form] = Form.useForm();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('logo_container')}>
                <img className={cx('logo')} src={logo} alt="logo" />
                <img className={cx('logo_title')} src={logotitle} alt="logotitle" />
            </div>

            <div className={cx('form_container')}>
                <Button className={cx('back_button')} type="text" onClick={() => onBack()}>
                    <LeftOutlined />
                </Button>
                <Form
                    className={cx('form')}
                    name="register-form"
                    initialValues={{ remember: true, email: email }}
                    onFinish={onFinish}
                    layout="vertical"
                    form={form}
                >
                    <h1 style={{ textAlign: 'center', fontSize: '4.5rem' }}>Hoàn tất thông tin</h1>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Tài khoản (Email)</label>}
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]}
                    >
                        <Input disabled size="large" prefix={<UserOutlined />} placeholder="Nhập Email" />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Tên người dùng</label>}
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]}
                    >
                        <Input
                            size="large"
                            prefix={<UserOutlined />}
                            placeholder="Nhập tên người dùng"
                            autoComplete="username"
                        />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Mật khẩu</label>}
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu"
                            autoComplete="new-password"
                        />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Nhập lại mật khẩu</label>}
                        name="repassword"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu của bạn!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Hai mật khẩu bạn đã nhập không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined />}
                            placeholder="Nhập lại mật khẩu"
                            autoComplete="new-password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            style={{ backgroundColor: 'var(--button-color)', width: '100%', fontSize: '1.7rem' }}
                            disabled={!!form.getFieldsError().filter(({ errors }) => errors.length).length}
                        >
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

function Register() {
    const [step, setStep] = useState(1);
    const [token, setToken] = useState('');
    const [expiry, setExpiry] = useState('');
    const [email, setEmail] = useState('');

    // Hàm chuyển sang bước tiếp theo
    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    return (
        <>
            {step === 1 && (
                <InputEmail setToken={setToken} setExpiry={setExpiry} setEmail={setEmail} onNext={handleNext} />
            )}
            {step === 2 && (
                <InputOTP
                    token={token}
                    expiry={expiry}
                    email={email}
                    setToken={setToken}
                    setExpiry={setExpiry}
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}
            {step === 3 && <RegisterForm email={email} onBack={handleBack} />}
        </>
    );
}

export default Register;
