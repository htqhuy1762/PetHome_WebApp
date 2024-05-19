import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { useState, useEffect, useContext } from 'react';
import * as userServices from '~/services/userServices';
import Loading from '~/components/Loading';
import { Form, Button, Input, DatePicker, Radio } from 'antd';
import moment from 'moment';
import { AuthContext } from '~/components/AuthProvider/index.jsx';

const cx = classNames.bind(styles);

function Profile() {
    const { refreshAccessToken } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            const expiredAt = localStorage.getItem('expiredAt');
            const accessToken = localStorage.getItem('accessToken');

            // Check if token exists and is not expired
            if (accessToken && new Date().getTime() < new Date(expiredAt).getTime()) {
                try {
                    const response = await userServices.getUser(accessToken);
                    if (response.status === 200) {
                        setUserData(response.data);
                    }
                } catch (error) {
                    // Handle error
                }
            } else if (accessToken && new Date().getTime() > new Date(expiredAt).getTime()) {
                await refreshAccessToken();
                try {
                    const response = await userServices.getUser(localStorage.getItem('accessToken'));
                    if (response.status === 200) {
                        setUserData(response.data);
                    }
                } catch (error) {
                    // Handle error
                }
            }

            setLoading(false);
        };

        getUser();
    }, []);

    useEffect(() => {
        if (userData) {
            form.setFieldsValue({
                email: userData.email,
                name: userData.name,
                phonenumber: userData.phone_num,
                gender: userData.gender,
                birthday: moment(userData?.day_of_birth),
            });
        }
    }, [userData, form]);

    if (loading) {
        return <Loading />; // Replace with your loading component or spinner
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <p style={{ fontSize: '2.3rem' }}>Hồ Sơ Của Tôi</p>
                <p style={{ color: 'rgba(0, 0, 0, .54)' }}>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            </div>
            <div className={cx('form')}>
                <Form
                    form={form}
                    className={cx('form')}
                    name="user-info-form"
                    initialValues={{
                        remember: true,
                        email: userData?.email,
                        name: userData?.name,
                        phonenumber: userData?.phone_num,
                        gender: userData?.gender,
                        birthday: userData?.day_of_birth,
                    }}
                    layout="horizontal"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 13 }}
                >
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem', textAlign: 'right' }}>Email</label>}
                        name="email"
                    >
                        <Input disabled size="medium" />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem', textAlign: 'right' }}>Tên</label>}
                        name="name"
                    >
                        <Input size="medium" autoComplete="name" />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem', textAlign: 'right' }}>Số điện thoại</label>}
                        name="phonenumber"
                    >
                        <Input
                            style={{ width: '100%' }}
                            size="medium"
                            autoComplete="phonenumber"
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem', textAlign: 'right' }}>Giới tính</label>}
                        name="gender"
                    >
                        <Radio.Group>
                            <Radio value={'male'}>Nam</Radio>
                            <Radio value={'female'}>Nữ</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label={<label style={{ fontSize: '1.6rem', textAlign: 'right' }}>Ngày sinh</label>}
                        name="birthday"
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            size="medium"
                            type="primary"
                            htmlType="submit"
                            style={{ backgroundColor: 'var(--button-next-color)', width: '100px', marginLeft: '180px' }}
                            disabled={!!form.getFieldsError().filter(({ errors }) => errors.length).length}
                        >
                            Lưu
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Profile;
