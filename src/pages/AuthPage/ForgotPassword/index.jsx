import classNames from 'classnames/bind';
import styles from './ForgotPassword.module.scss';
import { Form, Button, notification, Input } from 'antd';
import { LeftOutlined, LockOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import OtpInput from 'react-otp-input';
import * as authServices from '~/services/authServices';
import logo from '~/assets/images/logo.png';
import logotitle from '~/assets/images/logo-title.png';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function InputOTP({ onNext }) {
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [form] = Form.useForm();

    const verifyOTP = async () => {
        try {
            const isTokenExpired = new Date() > new Date(localStorage.getItem('resetTokenExpired'));
            if (isTokenExpired) {
                return;
            }

            const response = await authServices.verifyCodeResetPassword(
                { code: otp },
                localStorage.getItem('resetToken'),
            );
            if (response.status === 401) {
                //console.log(response.data.error);
                notification.error({
                    message: 'Error',
                    description: response.data.error,
                });
                return;
            } else {
                localStorage.setItem('resetToken', response.data.token);
                localStorage.setItem('resetTokenExpired', response.data.expiredAt);
                onNext();
            }
        } catch (error) {
            console.log('OTP verification failed:', error);
        }
    };

    const resendOTP = async () => {
        if (!resendDisabled) {
            const response = await authServices.sendCodeResetPassword({ email: localStorage.getItem('resetEmail') });
            localStorage.setItem('resetToken', response.data.token);
            localStorage.setItem('resetTokenExpired', response.data.expiredAt);

            // Bắt đầu đếm ngược
            setResendDisabled(true);
            setCountdown(60);
        }
    };
    
    const onBack = () => {
        navigate('/login');
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('resetToken');
        localStorage.removeItem('resetTokenExpired');
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

InputOTP.propTypes = {
    onNext: PropTypes.func.isRequired,
};

function ChangePassForm({ onBack }) {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const isTokenExpired = new Date() > new Date(localStorage.getItem('resetTokenExpired'));
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
                localStorage.getItem('resetToken'),
            );
            if (response.status === 200) {
                notification.success({
                    message: 'Success',
                    description: 'Cập nhật lại mật khẩu thành công!',
                });
                navigate('/login');
                localStorage.removeItem('resetEmail');
                localStorage.removeItem('resetToken');
                localStorage.removeItem('resetTokenExpired');
            } else {
                notification.error({
                    message: 'Error',
                    description: response.data.error,
                });
            }
        } catch (error) {
            console.log('Cập nhật lại mật khẩu thất bại:', error);
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
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    form={form}
                >
                    <h1 style={{ textAlign: 'center', fontSize: '4.5rem' }}>Cập nhật lại mật khẩu</h1>
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
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

ChangePassForm.propTypes = {
    onBack: PropTypes.func.isRequired,
};

function ForgotPassword() {
    const [step, setStep] = useState(1);

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    return (
        <>
            {step === 1 && <InputOTP onNext={handleNext} />}
            {step === 2 && <ChangePassForm onBack={handleBack} />}
        </>
    );
}

export default ForgotPassword;
