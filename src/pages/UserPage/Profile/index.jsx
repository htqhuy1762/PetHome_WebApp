import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { useState, useEffect } from 'react';
import * as userServices from '~/services/userServices';
import * as shopServices from '~/services/shopServices';
import Loading from '~/components/Loading';
import { Form, Button, Input, DatePicker, Radio, Upload, message, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [saving, setSaving] = useState(false);

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
            return false;
        }
        getBase64(file, (url) => {
            setImageUrl(url);
            setFileList([file]);
        });
        return false; // Ngăn không upload ngay lập tức
    };

    useEffect(() => {
        const checkShop = async () => {
            if (!localStorage.getItem('idShop')) {
                const responseIsRegister = await shopServices.checkIsRegisterShop();
                const responseIsActive = await shopServices.checkIsActiveShop();

                if (responseIsRegister.status === 200 || responseIsRegister.status === 201) {
                    if (responseIsRegister.data.message === 'User is shop owner') {
                        localStorage.setItem('idShop', responseIsActive.data.id_shop);
                    }
                }
            }
        };

        checkShop();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const values = await form.validateFields();
            if (values.day_of_birth) {
                // Sử dụng dayjs để kiểm tra tính hợp lệ của ngày
                const formattedDate = dayjs(values.day_of_birth).isValid()
                    ? dayjs(values.day_of_birth).format('YYYY-MM-DD')
                    : null;
                values.day_of_birth = formattedDate;
            } else {
                values.day_of_birth = null;
            }

            //Gửi thông tin người dùng
            const response = await userServices.updateUser(values);
            console.log(response);
            // Nếu có file ảnh mới, gửi ảnh lên server
            if (fileList.length > 0) {
                const response = await userServices.uploadAvatar(fileList[0]);
                if (response.status === 200) {
                    const newAvatarUrl = response.data.avatar;
                    setUserData((prevData) => ({
                        ...prevData,
                        avatar: newAvatarUrl,
                    }));
                } else {
                    message.error('Upload ảnh thất bại');
                }
            }

            if (response.status === 200) {
                message.success('Lưu thông tin thành công');
            }
        } catch (error) {
            message.error('Lưu thông tin thất bại');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            try {
                const response = await userServices.getUser();
                if (response.status === 200) {
                    setUserData(response.data);
                }
            } catch (error) {
                // Handle error
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
                phone_num: userData.phone_num,
                gender: userData.gender,
                day_of_birth: userData.day_of_birth ? dayjs(userData.day_of_birth) : null,
            });
        }
    }, [userData, form]);

    if (loading) {
        return (
            <div className={cx('wrapper')}>
                <Loading />
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <p style={{ fontSize: '2.3rem' }}>Hồ Sơ Của Tôi</p>
                <p style={{ color: 'rgba(0, 0, 0, .54)' }}>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            </div>
            <div className={cx('content')}>
                <div className={cx('form-container')}>
                    <Form
                        form={form}
                        className={cx('form')}
                        name="user-info-form"
                        // initialValues={{
                        //     remember: true,
                        //     email: userData?.email,
                        //     name: userData?.name,
                        //     phonenumber: userData?.phone_num,
                        //     gender: userData?.gender,
                        //     day_of_birth: dayjs(userData?.day_of_birth) || "",
                        // }}
                        layout="horizontal"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 15 }}
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
                            name="phone_num"
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
                                <Radio value={'other'}>Khác</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label={<label style={{ fontSize: '1.6rem', textAlign: 'right' }}>Ngày sinh</label>}
                            name="day_of_birth"
                        >
                            <DatePicker
                                format="DD/MM/YYYY"
                                value={userData?.day_of_birth ? dayjs(userData.day_of_birth) : null} // Đảm bảo giá trị hợp lệ hoặc null
                                onChange={(date) => form.setFieldsValue({ day_of_birth: date })} // Cập nhật giá trị khi người dùng chọn ngày
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                size="medium"
                                type="primary"
                                htmlType="submit"
                                onClick={handleSave}
                                style={{
                                    backgroundColor: 'var(--button-next-color)',
                                    width: '100px',
                                    marginLeft: '180px',
                                }}
                                loading={saving}
                                disabled={!!form.getFieldsError().filter(({ errors }) => errors.length).length}
                            >
                                Lưu
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className={cx('avatar-container')}>
                    <div className={cx('avatar')}>
                        <Avatar
                            size={150}
                            src={imageUrl || (userData?.avatar ? userData.avatar : null)}
                            icon={!imageUrl && !userData?.avatar ? <UserOutlined /> : null}
                            alt="avatar"
                        />
                    </div>
                    <div className={cx('upload-avatar')}>
                        <Upload
                            beforeUpload={beforeUpload}
                            fileList={fileList}
                            onRemove={() => {
                                setFileList([]);
                                setImageUrl(null);
                            }}
                        >
                            <Button type="primary">Chọn ảnh</Button>
                        </Upload>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
