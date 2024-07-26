import classNames from 'classnames/bind';
import styles from './ShopRegister.module.scss';
import { useState, useEffect } from 'react';
import { Form, Button, ConfigProvider, Input, Radio, Upload, Flex, message, Steps, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as shopServices from '~/services/shopServices';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);
const areas = [
    'Hà Nội',
    'Hồ Chí Minh',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'An Giang',
    'Bà Rịa - Vũng Tàu',
    'Bắc Giang',
    'Bắc Kạn',
    'Bạc Liêu',
    'Bắc Ninh',
    'Bến Tre',
    'Bình Định',
    'Bình Dương',
    'Bình Phước',
    'Bình Thuận',
    'Cà Mau',
    'Cao Bằng',
    'Đắk Lắk',
    'Đắk Nông',
    'Điện Biên',
    'Đồng Nai',
    'Đồng Tháp',
    'Gia Lai',
    'Hà Giang',
    'Hà Nam',
    'Hà Tĩnh',
    'Hải Dương',
    'Hậu Giang',
    'Hòa Bình',
    'Hưng Yên',
    'Khánh Hòa',
    'Kiên Giang',
    'Kon Tum',
    'Lai Châu',
    'Lâm Đồng',
    'Lạng Sơn',
    'Lào Cai',
    'Long An',
    'Nam Định',
    'Nghệ An',
    'Ninh Bình',
    'Ninh Thuận',
    'Phú Thọ',
    'Quảng Bình',
    'Quảng Nam',
    'Quảng Ngãi',
    'Quảng Ninh',
    'Quảng Trị',
    'Sóc Trăng',
    'Sơn La',
    'Tây Ninh',
    'Thái Bình',
    'Thái Nguyên',
    'Thanh Hóa',
    'Thừa Thiên Huế',
    'Tiền Giang',
    'Trà Vinh',
    'Tuyên Quang',
    'Vĩnh Long',
    'Vĩnh Phúc',
    'Yên Bái',
];

function ShopInfor({ onNext, formData, setFormData }) {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const handleBackClick = () => {
        navigate('/user/shop');
    };
    const areaOptions = areas.map((area) => ({
        value: area,
        label: area,
    }));
    const [areaContent, setAreaContent] = useState(formData.area || 'Hà Nội');

    const handleChange = (value) => {
        setAreaContent(value);
    };

    useEffect(() => {
        // Kiểm tra xem formData có dữ liệu hay không
        if (formData.name) {
            // Nếu có dữ liệu, set giá trị của trường "shopName" bằng giá trị từ formData
            form.setFieldsValue({ shopName: formData.name });
        }
        if (formData.address) {
            form.setFieldsValue({ shopAddress: formData.address });
        }
        if (formData.area) {
            form.setFieldsValue({ shopArea: formData.area });
        } else {
            form.setFieldsValue({ shopArea: 'Hà Nội' }); // Đặt giá trị mặc định
        }
    }, [formData, form]);

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
        getBase64(file, () => {
            setFormData({ ...formData, logo: file });
        });
        return false;
    };

    const handleRemove = () => {
        setFormData({ ...formData, logo: null });
    };

    const uploadButton = !formData.logo && (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    const handleNextClick = () => {
        form.validateFields()
            .then((values) => {
                setFormData({ ...formData, name: values.shopName, address: values.shopAddress, area: values.shopArea });
                onNext();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <div className={cx('wrapper')}>
            <h1 style={{ textAlign: 'center' }}>Thông tin shop</h1>
            <div className={cx('form_container')}>
                <Form
                    form={form}
                    layout="horizontal"
                    labelAlign="right"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 11 }}
                    initialValues={formData}
                >
                    <Form.Item
                        label="Tên cửa hàng"
                        name="shopName"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên cửa hàng!',
                            },
                        ]}
                    >
                        <Input type="text" placeholder="" />
                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ cửa hàng"
                        name="shopAddress"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập địa chỉ cửa hàng!',
                            },
                        ]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Khu vực"
                        name="shopArea"
                        initialValue={areaContent}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập khu vực!',
                            },
                        ]}
                    >
                        <Select
                            value={areaContent}
                            style={{ width: '100%' }}
                            onChange={handleChange}
                            options={areaOptions}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Logo"
                        name="logo"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn ảnh logo cho shop!',
                            },
                        ]}
                    >
                        <Flex gap="middle" wrap>
                            <Upload
                                listType="picture-card"
                                className="image-uploader"
                                showUploadList={{ showRemoveIcon: true }}
                                beforeUpload={(file) => beforeUpload(file)}
                                onRemove={handleRemove}
                            >
                                {formData.logo ? (
                                    <img
                                        src={URL.createObjectURL(formData.logo)}
                                        alt="avatar"
                                        style={{ width: '100%' }}
                                    />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </Flex>
                    </Form.Item>
                    <div className={cx('button-container')}>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        defaultColor: 'var(--button-next-color)',
                                        defaultBg: 'var(--button-back-color)',
                                        defaultBorderColor: 'var(--button-next-color)',
                                        defaultHoverBorderColor: 'var(--button-next-color)',
                                        defaultHoverBg: 'var(--button-back-color)',
                                        defaultHoverColor: 'var(--button-next-color)',
                                    },
                                },
                            }}
                        >
                            <Button className={cx('btn-back')} type="default" onClick={handleBackClick}>
                                Quay lại
                            </Button>
                        </ConfigProvider>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        defaultColor: 'white',
                                        defaultBg: 'var(--button-next-color)',
                                        defaultBorderColor: 'var(--button-next-color)',
                                        defaultHoverBorderColor: 'var(--button-next-color)',
                                        defaultHoverBg: 'var(--button-next-color)',
                                        defaultHoverColor: 'white',
                                    },
                                },
                            }}
                        >
                            <Button className={cx('btn-next')} type="default" onClick={handleNextClick}>
                                Tiếp theo
                            </Button>
                        </ConfigProvider>
                    </div>
                </Form>
            </div>
        </div>
    );
}

function TaxInfor({ onNext, onBack, formData, setFormData }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (formData.business_type) {
            form.setFieldsValue({ businessType: formData.business_type });
        }
        if (formData.tax_code) {
            form.setFieldsValue({ taxCode: formData.tax_code });
        }
    }, [formData, form]);

    const handleBackClick = () => {
        form.validateFields()
            .then((values) => {
                setFormData({ ...formData, tax_code: values.taxCode, business_type: values.businessType });
                onBack();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleNextClick = () => {
        form.validateFields()
            .then((values) => {
                setFormData({ ...formData, tax_code: values.taxCode, business_type: values.businessType });
                onNext();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <div className={cx('wrapper')}>
            <h1 style={{ textAlign: 'center', paddingBottom: '15px' }}>Thông tin thuế</h1>
            <div className={cx('form_container')}>
                <Form
                    form={form}
                    layout="horizontal"
                    labelAlign="right"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 11 }}
                    initialValues={formData}
                >
                    <Form.Item
                        label="Loại hình kinh doanh"
                        name="businessType"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn loại hình kinh doanh!',
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={'Cá nhân'}>Cá nhân</Radio>
                            <Radio value={'Hộ gia đình'}>Hộ gia đình</Radio>
                            <Radio value={'Công ty'}>Công ty</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="Mã số thuế"
                        name="taxCode"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mã số thuế!',
                            },
                        ]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <div className={cx('button-container')}>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        defaultColor: 'var(--button-next-color)',
                                        defaultBg: 'var(--button-back-color)',
                                        defaultBorderColor: 'var(--button-next-color)',
                                        defaultHoverBorderColor: 'var(--button-next-color)',
                                        defaultHoverBg: 'var(--button-back-color)',
                                        defaultHoverColor: 'var(--button-next-color)',
                                    },
                                },
                            }}
                        >
                            <Button className={cx('btn-back')} type="default" onClick={handleBackClick}>
                                Quay lại
                            </Button>
                        </ConfigProvider>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        defaultColor: 'white',
                                        defaultBg: 'var(--button-next-color)',
                                        defaultBorderColor: 'var(--button-next-color)',
                                        defaultHoverBorderColor: 'var(--button-next-color)',
                                        defaultHoverBg: 'var(--button-next-color)',
                                        defaultHoverColor: 'white',
                                    },
                                },
                            }}
                        >
                            <Button className={cx('btn-next')} type="default" onClick={handleNextClick}>
                                Tiếp theo
                            </Button>
                        </ConfigProvider>
                    </div>
                </Form>
            </div>
        </div>
    );
}

TaxInfor.propTypes = {
    onNext: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    setFormData: PropTypes.func.isRequired,
};

function IdentificationInfor({ onBack, formData, setFormData }) {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        if (formData.owner_name) {
            form.setFieldsValue({ fullName: formData.owner_name });
        }
        if (formData.id_card) {
            form.setFieldsValue({ idNumber: formData.id_card });
        }
    }, [formData, form]);

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUploadFront = (file) => {
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
        getBase64(file, () => {
            setFormData({ ...formData, front_id_card: file });
        });
        return false;
    };

    const beforeUploadBack = (file) => {
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
        getBase64(file, () => {
            setFormData({ ...formData, back_id_card: file });
        });
        return false;
    };

    const handleRemoveFront = () => {
        setFormData({ ...formData, front_id_card: null });
    };

    const handleRemoveBack = () => {
        setFormData({ ...formData, back_id_card: null });
    };

    const handleSubmit = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();
            setFormData((prevFormData) => ({
                ...prevFormData,
                owner_name: values.fullName,
                id_card: values.idNumber,
            }));

            const dataform = new FormData();

            dataform.append('name', formData.name);
            dataform.append('address', formData.address);
            dataform.append('area', formData.area);
            dataform.append('logo', formData.logo);
            dataform.append('tax_code', formData.tax_code);
            dataform.append('business_type', formData.business_type);
            dataform.append('owner_name', values.fullName);
            dataform.append('id_card', values.idNumber);
            dataform.append('front_id_card', formData.front_id_card);
            dataform.append('back_id_card', formData.back_id_card);

            const response = await shopServices.registerShop(dataform);

            if (response.status === 200) {
                navigate('/user/shop/complete');
            } else {
                console.log('Đăng ký shop thất bại');
            }
        } catch (error) {
            console.log('Đăng ký shop thất bại lỗi do lỗi', error);
        }
    };

    const uploadButton = !formData.front_id_card && (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    const uploadButton2 = !formData.back_id_card && (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    const handleBackClick = () => {
        form.validateFields()
            .then((values) => {
                setFormData({ ...formData, owner_name: values.fullName, id_card: values.idNumber });
                onBack();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <div className={cx('wrapper')}>
            <h1 style={{ textAlign: 'center', paddingBottom: '15px' }}>Thông tin xác thực</h1>
            <div className={cx('form_container')}>
                <Form
                    form={form}
                    layout="horizontal"
                    labelAlign="right"
                    labelCol={{ span: 7 }}
                    wrapperCol={{ span: 11 }}
                    initialValues={formData}
                >
                    <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập họ và tên của bạn!',
                            },
                        ]}
                    >
                        <Input type="text" placeholder="" />
                    </Form.Item>
                    <Form.Item
                        label="Mã số CCCD"
                        name="idNumber"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mã số CCCD của bạn!',
                            },
                        ]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Ảnh chụp mặt trước CCCD"
                        name="front_id_card"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn ảnh chụp mặt trước CCCD!',
                            },
                        ]}
                    >
                        <Flex gap="middle" wrap>
                            <Upload
                                listType="picture-card"
                                className="image-uploader"
                                showUploadList={{ showRemoveIcon: true }}
                                beforeUpload={(file) => beforeUploadFront(file)}
                                onRemove={handleRemoveFront}
                            >
                                {formData.front_id_card ? (
                                    <img
                                        src={URL.createObjectURL(formData.front_id_card)}
                                        alt="avatar"
                                        style={{ width: '100%' }}
                                    />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </Flex>
                    </Form.Item>
                    <Form.Item
                        label="Ảnh chụp mặt sau CCCD"
                        name="back_id_card"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn ảnh chụp mặt sau CCCD!',
                            },
                        ]}
                    >
                        <Flex gap="middle" wrap>
                            <Upload
                                listType="picture-card"
                                className="image-uploader"
                                showUploadList={{ showRemoveIcon: true }}
                                beforeUpload={(file) => beforeUploadBack(file)}
                                onRemove={handleRemoveBack}
                            >
                                {formData.back_id_card ? (
                                    <img
                                        src={URL.createObjectURL(formData.back_id_card)}
                                        alt="avatar"
                                        style={{ width: '100%' }}
                                    />
                                ) : (
                                    uploadButton2
                                )}
                            </Upload>
                        </Flex>
                    </Form.Item>
                    <div className={cx('button-container')}>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        defaultColor: 'var(--button-next-color)',
                                        defaultBg: 'var(--button-back-color)',
                                        defaultBorderColor: 'var(--button-next-color)',
                                        defaultHoverBorderColor: 'var(--button-next-color)',
                                        defaultHoverBg: 'var(--button-back-color)',
                                        defaultHoverColor: 'var(--button-next-color)',
                                    },
                                },
                            }}
                        >
                            <Button className={cx('btn-back')} type="default" onClick={handleBackClick}>
                                Quay lại
                            </Button>
                        </ConfigProvider>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        defaultColor: 'white',
                                        defaultBg: 'var(--button-next-color)',
                                        defaultBorderColor: 'var(--button-next-color)',
                                        defaultHoverBorderColor: 'var(--button-next-color)',
                                        defaultHoverBg: 'var(--button-next-color)',
                                        defaultHoverColor: 'white',
                                    },
                                },
                            }}
                        >
                            <Button className={cx('btn-next')} type="default" onClick={handleSubmit}>
                                Tiếp theo
                            </Button>
                        </ConfigProvider>
                    </div>
                </Form>
            </div>
        </div>
    );
}

IdentificationInfor.propTypes = {
    onBack: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    setFormData: PropTypes.func.isRequired,
};

function ShopRegister() {
    const [step, setStep] = useState(1);
    const { Step } = Steps;
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        area: '',
        logo: null,
        tax_code: '',
        business_type: null,
        owner_name: '',
        id_card: '',
        front_id_card: null,
        back_id_card: null,
    });

    const handleNext = () => {
        if (step === 3) {
            return;
        }
        setStep(step + 1);
    };

    const handleBack = () => {
        if (step === 1) {
            return;
        }
        setStep(step - 1);
    };

    return (
        <div className={cx('wrapper')}>
            <Steps progressDot style={{ padding: '40px 20px 20px 20px' }} current={step - 1}>
                <Step title="Thông tin cửa hàng" />
                <Step title="Thông tin thuế" />
                <Step title="Thông tin xác thực" />
                <Step title="Hoàn thành" />
            </Steps>
            {step === 1 && <ShopInfor onNext={handleNext} formData={formData} setFormData={setFormData} />}
            {step === 2 && (
                <TaxInfor onNext={handleNext} formData={formData} setFormData={setFormData} onBack={handleBack} />
            )}
            {step === 3 && (
                <IdentificationInfor
                    formData={formData}
                    setFormData={setFormData}
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}
        </div>
    );
}

ShopInfor.propTypes = {
    onNext: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    setFormData: PropTypes.func.isRequired,
};

export default ShopRegister;
