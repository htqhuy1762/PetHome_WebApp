import classNames from 'classnames/bind';
import styles from './ChangePass.module.scss';
import { Form, Input, Button, notification } from 'antd';
import * as authServices from '~/services/authServices';
import { useNavigate } from 'react-router-dom';
import { LockOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function ChangePass() {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
            const response = await authServices.changePassword(
                {
                    password: values.password,
                    new_password: values.new_password,
                },
                localStorage.getItem('accessToken'),
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
            if (error.response && error.response.status === 401) {
                notification.error({
                    message: 'Error',
                    description: 'Mật khẩu cũ không đúng',
                });
            } else {
                console.log('Đổi mật khẩu thất bại:', error);
            }
        }
    };
    const [form] = Form.useForm();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('form_container')}>
                <Form
                    className={cx('form')}
                    name="register-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                    form={form}
                >
                    <p style={{ textAlign: 'center', fontSize: '4rem', fontWeight: '500', padding: '15px 0' }}>Đổi mật khẩu</p>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Mật khẩu cũ</label>}
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới của bạn!' }]}
                    >
                        <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập mật khẩu cũ" />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Mật khẩu mới</label>}
                        name="new_password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới của bạn!' }]}
                    >
                        <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem' }}>Nhập lại mật khẩu mới</label>}
                        name="renew_password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập lại mật khẩu mới của bạn!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('new_password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Hai mật khẩu bạn đã nhập không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" />
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

export default ChangePass;
