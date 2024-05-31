import classNames from 'classnames/bind';
import styles from './ResetPass.module.scss';
import { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';
import { Form, Input, Button, notification } from 'antd';
import * as authServices from '~/services/authServices';
import * as userServices from '~/services/userServices';
import { useNavigate } from 'react-router-dom';
import { LeftOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function CheckEmail({ onNext, setToken, setExpiry, userData }) {
    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue({
            email: userData.email,
        });
    }, [form, userData.email]);

    const handleClick = async () => {
        try {
            // Check if the email is valid
            if (!userData.email || !form.getFieldError('email').length) {
                const response = await authServices.sendCodeResetPassword({ email: userData.email });

                if (response.status === 200) {
                    setToken(response.data.token);
                    setExpiry(response.data.expiredAt);
                    onNext();
                } else {
                    notification.error({
                        message: 'Error',
                        description: response.data.error,
                    });
                }
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
            <div className={cx('form_container')}>
                <Form
                    form={form}
                    className={cx('form')}
                    name="input-email-form"
                    initialValues={{ remember: true }}
                    layout="vertical"
                >
                    <h1 style={{ textAlign: 'center', fontSize: '5rem', marginBottom: '10px' }}>Xác minh email</h1>
                    <h3 style={{ textAlign: 'center', fontSize: '1.5rem', color: 'gray', marginBottom: '30px' }}>
                        Chúng tôi sẽ gửi cho bạn mã xác minh để chúng tôi biết bạn là thật.
                    </h3>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Email</label>}
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email của bạn!' },
                            { type: 'email', message: 'Email không hợp lệ!' },
                        ]}
                    >
                        <Input
                            disabled
                            size="large"
                            prefix={<UserOutlined />}
                            placeholder="Nhập Email"
                            //style={{ pointerEvents: 'none' }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            size="large"
                            type="primary"
                            style={{ backgroundColor: 'var(--button-next-color)', width: '100%', fontSize: '1.7rem' }}
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

function InputOTP({ onNext, onBack, token, expiry, userData, setToken, setExpiry }) {
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

            const response = await authServices.verifyCodeResetPassword({ code: otp }, token);
            if (response.status === 401) {
                //console.log(response.data.error);
                notification.error({
                    message: 'Error',
                    description: response.data.error,
                });
                return;
            } else {
                setToken(response.data.token);
                setExpiry(response.data.expiredAt);
                onNext();
            }
        } catch (error) {
            console.log('OTP verification failed:', error);
        }
    };

    const resendOTP = async () => {
        if (!resendDisabled) {
            const response = await authServices.sendCodeResetPassword({ email: userData.email });
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
                    <h3 style={{ textAlign: 'center', fontSize: '1.5rem', color: 'gray', marginBottom: '30px' }}>
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
                            style={{ backgroundColor: 'var(--button-next-color)', width: '100%', fontSize: '1.7rem' }}
                            onClick={verifyOTP}
                            disabled={otp.length !== 6}
                        >
                            Tiếp tục
                        </Button>
                    </Form.Item>
                    <h3 style={{ textAlign: 'center', fontSize: '1.5rem', color: 'gray' }}>
                        Bạn không nhận được mã OTP?
                    </h3>
                    <Form.Item style={{ textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                        <Button
                            style={{
                                fontWeight: '650',
                                display: 'flex',
                                alignItems: 'center',
                                color: resendDisabled ? 'gray' : 'var(--button-next-color)',
                                fontSize: '1.7rem',
                            }}
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

function ChangePassForm({ onBack, token, expiry }) {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const isTokenExpired = new Date() > new Date(expiry);
            if (isTokenExpired) {
                notification.error({
                    message: 'Error',
                    description: 'Mã OTP đã hết hạn!',
                });
                return;
            }

            const response = await authServices.resetPassword(
                {
                    new_password: values.password,
                },
                token,
            );
            if (response.status === 200) {
                notification.success({
                    message: 'Success',
                    description: 'Đổi mật khẩu thành công!',
                });
                navigate('/');
            } else {
                notification.error({
                    message: 'Error',
                    description: response.data.error,
                });
            }
        } catch (error) {
            console.log('Đổi mật khẩu thất bại:', error);
        }
    };
    const [form] = Form.useForm();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('form_container')}>
                <Button className={cx('back_button')} type="text" onClick={() => onBack()}>
                    <LeftOutlined />
                </Button>
                <Form
                    className={cx('form')}
                    name="register-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    form={form}
                >
                    <h1 style={{ textAlign: 'center', fontSize: '4.5rem' }}>Đổi mật khẩu</h1>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Mật khẩu mới</label>}
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới của bạn!' }]}
                    >
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu"
                            autoComplete="new-password"
                        />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Nhập lại mật khẩu mới</label>}
                        name="repassword"
                        rules={[
                            { required: true, message: 'Vui lòng nhập lại mật khẩu mới của bạn!' },
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
                            style={{ backgroundColor: 'var(--button-next-color)', width: '100%', fontSize: '1.7rem' }}
                            disabled={!!form.getFieldsError().filter(({ errors }) => errors.length).length}
                        >
                            Thay đổi
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

function ResetPass() {
    const [step, setStep] = useState(1);
    const [token, setToken] = useState('');
    const [expiry, setExpiry] = useState('');
    const [userData, setUserData] = useState('');

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await userServices.getUser();
                if (response.status === 200) {
                    setUserData(response.data);
                }
            } catch (error) {
                // Handle error
            }
        };

        getUser();
    }, []);

    return (
        <>
            {step === 1 && (
                <CheckEmail setToken={setToken} setExpiry={setExpiry} userData={userData} onNext={handleNext} />
            )}
            {step === 2 && (
                <InputOTP
                    token={token}
                    expiry={expiry}
                    userData={userData}
                    setToken={setToken}
                    setExpiry={setExpiry}
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}
            {step === 3 && <ChangePassForm onBack={handleBack} token={token} expiry={expiry} />}
        </>
    );
}

export default ResetPass;
