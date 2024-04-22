import { useState } from 'react';
import OtpInput from 'react-otp-input';
import styles from './Register.module.scss';
import classNames from 'classnames/bind';
import logo from '../../assets/images/logo.png';
import logotitle from '../../assets/images/logo-title.png';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function InputEmail({ onNext }) {
    const [email, setEmail] = useState('');

    return (
        <div className={cx('wrapper')}>
            <div className={cx('logo_container')}>
                <img className={cx('logo')} src={logo} alt="logo" />
                <img className={cx('logo_title')} src={logotitle} alt="logotitle" />
            </div>

            <div className={cx('form_container')}>
                <Form
                    className={cx('form')}
                    name="input-email-form"
                    initialValues={{ remember: true }}
                    layout="vertical"
                >
                    <h1 style={{ textAlign: 'center', fontSize: '5rem' }}>Nhập Email</h1>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Email</label>}
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]}
                    >
                        <Input
                            size="large"
                            prefix={<UserOutlined />}
                            placeholder="Nhập Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            size="large"
                            type="primary"
                            style={{ backgroundColor: 'var(--color-button)', width: '100%', fontSize: '1.7rem' }}
                            onClick={() => onNext()}
                        >
                            Gửi mã OTP
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

function InputOTP({ onNext }) {
    const [otp, setOtp] = useState('');

    return (
        <div className={cx('wrapper')}>
            <div className={cx('logo_container')}>
                <img className={cx('logo')} src={logo} alt="logo" />
                <img className={cx('logo_title')} src={logotitle} alt="logotitle" />
            </div>

            <div className={cx('form_container')}>
                <Form className={cx('form')} name="input-otp-form" initialValues={{ remember: true }} layout="vertical">
                    <h1 style={{ textAlign: 'center', fontSize: '5rem' }}>Nhập mã OTP</h1>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Mã OTP</label>}
                        name="otp"
                        rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }]}
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
                            style={{ backgroundColor: 'var(--color-button)', width: '100%', fontSize: '1.7rem' }}
                            onClick={() => onNext()}
                        >
                            Tiếp tục
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

function RegisterForm() {
    const onFinish = (values) => {
        console.log('Received values:', values);
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
                    name="register-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <h1 style={{ textAlign: 'center', fontSize: '5rem' }}>Đăng ký</h1>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Tài khoản (Email)</label>}
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]}
                    >
                        <Input size="large" prefix={<UserOutlined />} placeholder="Nhập Email" />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Tên người dùng</label>}
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]}
                    >
                        <Input size="large" prefix={<UserOutlined />} placeholder="Nhập tên người dùng" />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Mật khẩu</label>}
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
                    >
                        <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Nhập lại mật khẩu</label>}
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
                    >
                        <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            style={{ backgroundColor: 'var(--color-button)', width: '100%', fontSize: '1.7rem' }}
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

    // Hàm chuyển sang bước tiếp theo
    const handleNext = () => {
        setStep(step + 1);
    };

    return (
        <>
            {step === 1 && <InputEmail onNext={handleNext} />}
            {step === 2 && <InputOTP onNext={handleNext} />}
            {step === 3 && <RegisterForm />}
        </>
    );
}

export default Register;
