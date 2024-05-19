import classNames from 'classnames/bind';
import styles from './ShopRegister.module.scss';
import { useState } from 'react';
import { Form, Button, ConfigProvider, Input, Radio, Upload, Flex, message, Steps } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function ShopInfor({ onNext }) {
    const navigate = useNavigate();
    const handleBackClick = () => {
        navigate('/user/shop');
    };
    return (
        <div className={cx('wrapper')}>
            <h1 style={{ textAlign: 'center' }}>Thông tin shop</h1>
            <div className={cx('form_container')}>
                <Form layout="horizontal" labelAlign="right" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                    <Form.Item
                        label="Tên cửa hàng"
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
                        label="Email"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập email!',
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
                            <Button className={cx('btn-next')} type="default" onClick={onNext}>
                                Tiếp theo
                            </Button>
                        </ConfigProvider>
                    </div>
                </Form>
            </div>
        </div>
    );
}

function TaxInfor({ onNext, onBack }) {
    return (
        <div className={cx('wrapper')}>
            <h1 style={{ textAlign: 'center', paddingBottom: '15px' }}>Thông tin thuế</h1>
            <div className={cx('form_container')}>
                <Form layout="horizontal" labelAlign="right" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                    <Form.Item
                        label="Loại hình kinh doanh"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên cửa hàng!',
                            },
                        ]}
                    >
                        <Radio.Group defaultValue={1}>
                            <Radio value={1}>Cá nhân</Radio>
                            <Radio value={2}>Hộ gia đình</Radio>
                            <Radio value={3}>Công ty</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ đăng ký kinh doanh"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập địa chỉ đăng ký kinh doanh!',
                            },
                        ]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Mã số thuế"
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
                            <Button className={cx('btn-back')} type="default" onClick={onBack}>
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
                            <Button className={cx('btn-next')} type="default" onClick={onNext}>
                                Tiếp theo
                            </Button>
                        </ConfigProvider>
                    </div>
                </Form>
            </div>
        </div>
    );
}

function IdentificationInfor({ onNext, onBack }) {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
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
        const hasUploadedFile = fileList.length > 0;
        if (hasUploadedFile) {
            message.error('You can only upload one image!');
            return false;
        }
        return true;
    };

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
    
            setFileList([info.file]);
        }
    };
    
    const handleSubmit = async () => {
        if (!imageUrl) {
            message.error('Please upload an image.');
            return;
        }
        // Handle form submission here
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('front_id_card', file);
        });
    
        const response = await fetch('http://localhost:8080/api/shop/submit', {
            method: 'POST',
            body: formData,
        });
    
        if (!response.ok) {
            // handle error
        } else {
            onNext();
        }
    };

    const uploadButton = !imageUrl && (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    return (
        <div className={cx('wrapper')}>
            <h1 style={{ textAlign: 'center', paddingBottom: '15px' }}>Thông tin xác thực</h1>
            <div className={cx('form_container')}>
                <Form layout="horizontal" labelAlign="right" labelCol={{ span: 7 }} wrapperCol={{ span: 11 }}>
                    <Form.Item
                        label="Họ và tên"
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
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập mã số cccd của bạn!',
                            },
                        ]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item
                        label="Ảnh chụp mặt trước CCCD"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn ảnh chụp mặt trước CCCD!',
                            },
                        ]}
                    >
                        <Flex gap="middle" wrap>
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action=""
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                                fileList={fileList}
                            >
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="avatar"
                                        style={{
                                            width: '100%',
                                        }}
                                    />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </Flex>
                    </Form.Item>
                    <Form.Item
                        label="Ảnh chụp mặt sau CCCD"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn ảnh chụp mặt sau CCCD!',
                            },
                        ]}
                    >
                        <Flex gap="middle" wrap>
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action=""
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                                fileList={fileList}
                            >
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="avatar"
                                        style={{
                                            width: '100%',
                                        }}
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
                            <Button className={cx('btn-back')} type="default" onClick={onBack}>
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

function Completed({}) {
    const navigate = useNavigate();

    return (
        <div className={cx('wrapper')}>
            <h1 style={{ textAlign: 'center', paddingBottom: '15px' }}>Hoàn thành!</h1>
            <div className={cx('content')}>
                <p style={{ textAlign: 'center', fontSize: '1.6 rem' }}>
                    Bạn đã hoàn thành thủ tục để đăng ký cửa hàng. <br />
                    Chúng tôi sẽ kiểm duyệt trong thời gian sớm nhất (thời gian chậm nhất là 1 tuần).
                    <br /> Pet Home chân thành cảm ơn!
                </p>
                <div className={cx('button-container')} style={{ justifyContent: 'center', width: '100%' }}>
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
                        <Button className={cx('btn-next')} type="default" onClick={null}>
                            Đi đến cửa hàng của tôi
                        </Button>
                    </ConfigProvider>
                </div>
            </div>
        </div>
    );
}

function ShopRegister() {
    const [step, setStep] = useState(1);
    const { Step } = Steps;

    const handleNext = () => {
        setStep(step + 1);
    };

    const handleBack = () => {
        setStep(step - 1);
    };

    return (
        <div className={cx('wrapper')}>
            <Steps progressDot style={{ padding: '40px 20px 20px 20px' }} current={step - 1}>
                <Step title="Shop Information" />
                <Step title="Tax Information" />
                <Step title="Identification Information" />
                <Step title="Completed" />
            </Steps>
            {step === 1 && <ShopInfor onNext={handleNext} />}
            {step === 2 && <TaxInfor onNext={handleNext} onBack={handleBack} />}
            {step === 3 && <IdentificationInfor onNext={handleNext} onBack={handleBack} />}
            {step === 4 && <Completed onBack={handleBack} />}
        </div>
    );
}

export default ShopRegister;
