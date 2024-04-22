import styles from './Register.module.scss';
import classNames from 'classnames/bind';
import logo from '../../assets/images/logo.png';
import logotitle from '../../assets/images/logo-title.png';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function Register() {
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
                        label={<label style={{fontSize: '1.6rem'}}>Tài khoản (Email)</label>}
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]}
                    >
                        <Input size="large" prefix={<UserOutlined />} placeholder="Nhập Email" />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{fontSize: '1.6rem'}}>Tên người dùng</label>}
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email của bạn!' }]}
                    >
                        <Input size="large" prefix={<UserOutlined />} placeholder="Nhập tên người dùng" />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{fontSize: '1.6rem'}}>Mật khẩu</label>}
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
                    >
                        <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{fontSize: '1.6rem'}}>Nhập lại mật khẩu</label>}
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn!' }]}
                    >
                        <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
                    </Form.Item>
                    <Form.Item>
                        <Button size="large" type="primary" htmlType="submit" style={{ width: '100%', fontSize: '1.7rem' }}>
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Register;
