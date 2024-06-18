import classNames from 'classnames/bind';
import styles from './ShopProfile.module.scss';
import { useState, useEffect } from 'react';
import * as shopServices from '~/services/shopServices';
import Loading from '~/components/Loading';
import { Form, Button, Input, Upload, message, Avatar, Image } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

function ShopProfile() {
    const [shopData, setShopData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);
    const [fileList, setFileList] = useState([]);

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
        return false;
    };

    const handleSave = async () => {
        try {
            // Nếu có file ảnh mới, gửi ảnh lên server
            if (fileList.length > 0) {
                const response = await shopServices.uploadAvatar(fileList[0]);
                if (response.status === 200) {
                    const newAvatarUrl = response.data.logo;
                    setShopData((prevData) => ({
                        ...prevData,
                        logo: newAvatarUrl,
                    }));
                } else {
                    message.error('Cập nhật ảnh thất bại');
                }
            }
        } catch (error) {
            message.error('Lưu thông tin thất bại');
        }
    };

    useEffect(() => {
        const getShop = async () => {
            setLoading(true);
            try {
                const response = await shopServices.getShopDetail();
                if (response.status === 200) {
                    setShopData(response.data);
                }
            } catch (error) {
                // Handle error
            }
            setLoading(false);
        };

        getShop();
    }, []);

    useEffect(() => {
        if (shopData) {
            form.setFieldsValue({
                name: shopData?.name,
                business_type: shopData?.business_type,
                tax_code: shopData?.tax_code,
                owner_name: shopData?.owner_name,
                id_card: shopData?.id_card,
                front_id_card: shopData?.front_id_card,
                back_id_card: shopData?.back_id_card,
            });
        }
    }, [shopData, form]);

    if (loading) {
        return <Loading />;
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
                        name="shop-info-form"
                        initialValues={{
                            remember: true,
                            name: shopData?.name,
                            business_type: shopData?.business_type,
                            tax_code: shopData?.tax_code,
                            owner_name: shopData?.owner_name,
                            id_card: shopData?.id_card,
                            front_id_card: shopData?.front_id_card,
                            back_id_card: shopData?.back_id_card,
                        }}
                        layout="horizontal"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 15 }}
                    >
                        <Form.Item
                            label={<label style={{ fontSize: '1.6rem', textAlign: 'right' }}>Tên cửa hàng</label>}
                            name="name"
                        >
                            <Input disabled size="medium" />
                        </Form.Item>
                        <Form.Item
                            label={
                                <label style={{ fontSize: '1.6rem', textAlign: 'right' }}>Loại hình kinh doanh</label>
                            }
                            name="business_type"
                        >
                            <Input disabled size="medium" />
                        </Form.Item>
                        <Form.Item
                            label={<label style={{ fontSize: '1.6rem', textAlign: 'right' }}>Mã số thuế</label>}
                            name="tax_code"
                        >
                            <Input disabled size="medium" />
                        </Form.Item>
                        <Form.Item
                            label={<label style={{ fontSize: '1.6rem', textAlign: 'right' }}>Tên chủ cửa hàng</label>}
                            name="owner_name"
                        >
                            <Input disabled size="medium" />
                        </Form.Item>
                        <Form.Item
                            label={<label style={{ fontSize: '1.6rem', textAlign: 'right' }}>Số CCCD</label>}
                            name="id_card"
                        >
                            <Input disabled size="medium" />
                        </Form.Item>
                        <Form.Item
                            label={<label style={{ fontSize: '1.6rem', textAlign: 'right' }}>Mặt trước CCCD</label>}
                            name="front_id_card"
                        >
                            <Image
                                alt="front id card"
                                src={shopData?.front_id_card}
                                style={{
                                    width: 400,
                                    height: 267,
                                }}
                                preview={true}
                            />
                        </Form.Item>
                        <Form.Item
                            label={<label style={{ fontSize: '1.6rem', textAlign: 'right' }}>Mặt sau CCCD</label>}
                            name="back_id_card"
                        >
                            <Image
                                alt="back id card"
                                src={shopData?.back_id_card}
                                style={{
                                    width: 400,
                                    height: 267,
                                }}
                                preview={true}
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
                            src={imageUrl || (shopData?.logo ? shopData.logo : null)}
                            icon={!imageUrl && !shopData?.logo ? <ShopOutlined /> : null}
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

export default ShopProfile;
