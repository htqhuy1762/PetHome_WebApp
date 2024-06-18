import classNames from 'classnames/bind';
import styles from './ManagementService.module.scss';
import {
    Tabs,
    ConfigProvider,
    Button,
    Modal,
    Input,
    InputNumber,
    Upload,
    message,
    Form,
    Select,
    Menu,
    Checkbox,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ListService from './ListService';
import ListServiceRequest from './ListServiceRequest';
import { useState, useEffect } from 'react';
import * as shopServices from '~/services/shopServices';
import * as servicePetServices from '~/services/servicePetServices';
import { useNavigate, useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function ManagementService() {
    const [selectedTab, setSelectedTab] = useState('1');
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [listAddress, setListAddress] = useState([]);
    const [listTypeService, setListTypeService] = useState([]);
    const [headerImage, setHeaderImage] = useState([]);
    const [images, setImages] = useState([]);
    const [itemMenu, setItemMenu] = useState([]);
    const [serviceAdded, setServiceAdded] = useState(false);


    const [selectedServiceTypeDetailId, setSelectedServiceTypeDetailId] = useState(1);
    const [selectedServiceTypeDetailName, setSelectedServiceTypeDetailName] = useState('Tắm và vệ sinh');
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const serviceTypeDetailId = searchParams.get('serviceTypeDetailId');
        const tab = searchParams.get('tab');

        if (serviceTypeDetailId) {
            setSelectedServiceTypeDetailId(Number(serviceTypeDetailId));
        }
        if (tab) {
            setSelectedTab(tab);
        }

        const fetchServiceTypes = async () => {
            try {
                const response = await servicePetServices.getServiceTypes();
                if (response.status === 200) {
                    let types = response.data;

                    // Sort types by id_service_type
                    types = types.sort((a, b) => a.id_service_type - b.id_service_type);

                    // Fetch details for each service type
                    const detailsPromises = types.map((type) =>
                        servicePetServices.getServiceTypeDetail(type.id_service_type),
                    );
                    const detailsResponses = await Promise.all(detailsPromises);

                    const newItems = types.map((type, index) => {
                        let details = detailsResponses[index].data;
                        if (detailsResponses[index].status === 200) {
                            // Sort details by id_service_type_detail
                            details = details.sort((a, b) => a.id_service_type_detail - b.id_service_type_detail);
                        }

                        return {
                            key: `type-${type.id_service_type}`,
                            label: type.name,
                            children: details.map((detail) => ({
                                key: `type-${type.id_service_type}-detail-${detail.id_service_type_detail}`,
                                label: detail.name,
                                onClick: () => {
                                    setSelectedServiceTypeDetailName(detail.name);
                                    setSelectedServiceTypeDetailId(detail.id_service_type_detail);
                                    navigate(
                                        `?serviceTypeDetailId=${detail.id_service_type_detail}&tab=${selectedTab}`,
                                    );
                                },
                            })),
                        };
                    });

                    setItemMenu(newItems);

                    // // Fetch services if name is set in the URL
                    // if (name) {
                    //     const selectedDetail = newItems.flatMap(item => item.children).find(child => child.label === name);
                    //     if (selectedDetail) {
                    //         //const detailId = selectedDetail.key.split('-detail-')[1];
                    //         //setCurrentId(detailId);
                    //         //fetchServices(detailId, currentPage);
                    //         //setSelectedKeys([selectedDetail.key]);
                    //     }
                    // }
                }
            } catch (error) {
                console.error('Failed to fetch service types or details', error);
            } finally {
                //setLoading(false);
            }
        };

        fetchServiceTypes();
    }, [location.search, navigate, selectedTab]);

    const handleAddServiceClick = () => {
        setIsModalVisible(true);
    };

    const handleTabChange = (key) => {
        setSelectedTab(key);
        navigate(`?serviceTypeDetailId=${selectedServiceTypeDetailId}&tab=${key}`);
    };

    const beforeUploadHeaderImage = (file) => {
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
        setHeaderImage([file]);
        return false;
    };

    const beforeUploadImages = (file) => {
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
        setImages([...images, file]);
        return false;
    };

    const handleRemoveHeaderImage = () => {
        setHeaderImage([]);
    };

    const handleRemoveImage = (file) => {
        setImages(images.filter((image) => image.uid !== file.uid));
    };

    const uploadButtonHeaderImage = headerImage.length === 0 && (
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

    const uploadButtonImages = images.length < 4 && (
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

    const items = [
        {
            key: '1',
            label: 'Dịch vụ của bạn',
            children: (
                <ListService
                    idServiceTypeDetail={selectedServiceTypeDetailId}
                    nameServiceTypeDetail={selectedServiceTypeDetailName}
                />
            ),
        },
        {
            key: '2',
            label: 'Đang yêu cầu',
            children: (
                <ListServiceRequest
                    idServiceTypeDetail={selectedServiceTypeDetailId}
                    nameServiceTypeDetail={selectedServiceTypeDetailName}
                    serviceAdded={serviceAdded}
                />
            ),
        },
    ];

    const handleOk = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();

            if (headerImage.length === 0) {
                message.error('Vui lòng chọn ảnh đại diện!');
                return;
            }

            if (images.length === 0) {
                message.error('Vui lòng chọn ảnh mô tả!');
                return;
            }

            const updatedFormData = new FormData();
            updatedFormData.append('header_image', headerImage[0]);
            images.forEach((image) => {
                updatedFormData.append('images', image);
            });
            updatedFormData.append('name', values.name);
            updatedFormData.append('min_price', values.min_price);
            updatedFormData.append('max_price', values.max_price);
            updatedFormData.append('id_service_type_detail', values.id_service_type_detail);
            values.id_address.forEach((address) => {
                updatedFormData.append('id_address', address);
            });
            updatedFormData.append('description', values.description);

            console.log(updatedFormData);
            // Here you can add the code to send updatedFormData to your backend
            const response = await shopServices.addServiceRequest(updatedFormData);

            console.log(response.data);
            if (response.status === 200) {
                message.success('Thêm dịch vụ thành công');
                form.resetFields();
                setHeaderImage([]);
                setImages([]);
                setIsModalVisible(false);
                setServiceAdded(!serviceAdded);
            } else {
                message.error('Thêm dịch vụ thất bại');
                setIsModalVisible(false);
            }
        } catch (errorInfo) {
            console.log('Validate Failed:', errorInfo);
        }
    };

    const handleCancel = () => {
        setHeaderImage([]);
        setImages([]);
        setIsModalVisible(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await shopServices.getShopInfo(localStorage.getItem('idShop'));
            if (response.status === 200) {
                setListAddress(response.data.areas);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await servicePetServices.getServiceTypes();
            if (response.status === 200) {
                const sortedData = response.data.sort((a, b) => a.id_service_type - b.id_service_type);
                setListTypeService(sortedData);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h1>Dịch vụ</h1>
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
                    <Button className={cx('btn-add-address')} icon={<PlusOutlined />} onClick={handleAddServiceClick}>
                        Thêm dịch vụ mới
                    </Button>
                </ConfigProvider>
                <Modal title="Thêm dịch vụ" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Ảnh đại diện"
                            name="header_image"
                            rules={[{ required: true, message: 'Vui lòng chọn ảnh đại diện!' }]}
                        >
                            <Upload
                                listType="picture-card"
                                fileList={headerImage.map((file) => ({
                                    uid: file.uid,
                                    name: file.name,
                                    status: 'done',
                                    url: URL.createObjectURL(file),
                                }))}
                                showUploadList={{ showRemoveIcon: true }}
                                beforeUpload={beforeUploadHeaderImage}
                                onRemove={handleRemoveHeaderImage}
                            >
                                {uploadButtonHeaderImage}
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            label="Các ảnh mô tả (tối đa 4 hình)"
                            name="images"
                            rules={[{ required: true, message: 'Vui lòng chọn ảnh mô tả!' }]}
                        >
                            <Upload
                                listType="picture-card"
                                fileList={images.map((file) => ({
                                    uid: file.uid,
                                    name: file.name,
                                    status: 'done',
                                    url: URL.createObjectURL(file),
                                }))}
                                showUploadList={{ showRemoveIcon: true }}
                                beforeUpload={beforeUploadImages}
                                onRemove={handleRemoveImage}
                            >
                                {uploadButtonImages}
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            label="Tên dịch vụ"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
                        >
                            <Input.TextArea autoSize="true" maxLength={200} showCount />
                        </Form.Item>

                        <Form.Item
                            label="Giá thấp nhất (VNĐ)"
                            name="min_price"
                            rules={[{ required: true, message: 'Vui lòng nhập giá thấp nhất!' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Giá cao nhất (VNĐ)"
                            name="max_price"
                            rules={[{ required: true, message: 'Vui lòng nhập giá cao nhất!' }]}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Loại dịch vụ"
                            name="id_service_type_detail"
                            rules={[{ required: true, message: 'Vui lòng chọn loại dịch vụ!' }]}
                        >
                            <Select
                                options={listTypeService?.map((typeService) => ({
                                    label: typeService.name,
                                    options: typeService.service_type_detail?.map((serviceTypeDetail) => ({
                                        label: serviceTypeDetail.name,
                                        value: serviceTypeDetail.id_service_type_detail,
                                    })),
                                }))}
                            ></Select>
                        </Form.Item>

                        <Form.Item
                            label="Khu vực cung cấp dịch vụ"
                            name="id_address"
                            rules={[{ required: true, message: 'Vui lòng chọn khu vực cung cấp dịch vụ!' }]}
                        >
                            <Checkbox.Group
                                options={listAddress?.map((address) => ({
                                    label: address.address,
                                    value: address.id_address,
                                }))}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                        >
                            <Input.TextArea
                                autoSize="true"
                                maxLength={200}
                                showCount
                                style={{ marginBottom: '25px' }}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            <Menu
                style={{ width: '100%', marginBottom: '25px' }}
                defaultOpenKeys={items.map((item) => item.key)}
                mode="horizontal"
                items={itemMenu}
                //selectedKeys={selectedKeys}
            />
            <Tabs
                activeKey={selectedTab}
                onChange={handleTabChange}
                defaultActiveKey="1"
                items={items}
                size="large"
                centered
                tabBarGutter={340}
            />
        </div>
    );
}

export default ManagementService;
