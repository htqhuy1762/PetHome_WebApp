import classNames from 'classnames/bind';
import styles from './ManagementItem.module.scss';
import { Tabs, ConfigProvider, Button, Modal, Input, Upload, message, Form, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ListItem from './ListItem';
import ListItemRequest from './ListItemRequest';
import { useState, useEffect } from 'react';
import * as shopServices from '~/services/shopServices';
// import * as itemServices from '~/services/itemServices';

const cx = classNames.bind(styles);

function ManagementItem() {
    //const [form] = Form.useForm();
    // const [isModalVisible, setIsModalVisible] = useState(false);
    // const [listSpecie, setListSpecie] = useState([]);
    // const [listAge, setListAge] = useState([]);
    //const [headerImage, setHeaderImage] = useState([]);
   // const [images, setImages] = useState([]);

    // const handleAddItemClick = () => {
    //     setIsModalVisible(true);
    // };

    // const beforeUploadHeaderImage = (file) => {
    //     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    //     if (!isJpgOrPng) {
    //         message.error('You can only upload JPG/PNG file!');
    //         return false;
    //     }
    //     const isLt2M = file.size / 1024 / 1024 < 2;
    //     if (!isLt2M) {
    //         message.error('Image must be smaller than 2MB!');
    //         return false;
    //     }
    //     setHeaderImage([file]);
    //     return false;
    // };

    // const beforeUploadImages = (file) => {
    //     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    //     if (!isJpgOrPng) {
    //         message.error('You can only upload JPG/PNG file!');
    //         return false;
    //     }
    //     const isLt2M = file.size / 1024 / 1024 < 2;
    //     if (!isLt2M) {
    //         message.error('Image must be smaller than 2MB!');
    //         return false;
    //     }
    //     setImages([...images, file]);
    //     return false;
    // };

    // const handleRemoveHeaderImage = () => {
    //     setHeaderImage([]);
    // };

    // const handleRemoveImage = (file) => {
    //     setImages(images.filter((image) => image.uid !== file.uid));
    // };

    // const uploadButtonHeaderImage = headerImage.length === 0 && (
    //     <button
    //         style={{
    //             border: 0,
    //             background: 'none',
    //         }}
    //         type="button"
    //     >
    //         <PlusOutlined />
    //         <div
    //             style={{
    //                 marginTop: 8,
    //             }}
    //         >
    //             Upload
    //         </div>
    //     </button>
    // );

    // const uploadButtonImages = images.length < 4 && (
    //     <button
    //         style={{
    //             border: 0,
    //             background: 'none',
    //         }}
    //         type="button"
    //     >
    //         <PlusOutlined />
    //         <div
    //             style={{
    //                 marginTop: 8,
    //             }}
    //         >
    //             Upload
    //         </div>
    //     </button>
    // );

    const items = [
        {
            key: '1',
            label: 'Vật phẩm của bạn',
            children: <ListItem />,
        },
        {
            key: '2',
            label: 'Đang yêu cầu',
            children: <ListItemRequest />,
        },
    ];

    // const handleOk = async () => {
    //     try {
    //         await form.validateFields();
    //         const values = form.getFieldsValue();

    //         const updatedFormData = new FormData();
    //         updatedFormData.append('header_image', headerImage[0]);
    //         images.forEach((image) => {
    //             updatedFormData.append('images', image);
    //         });
    //         updatedFormData.append('name', values.name);
    //         updatedFormData.append('price', values.price);
    //         updatedFormData.append('id_pet_specie', values.id_pet_specie);
    //         updatedFormData.append('id_pet_age', values.id_pet_age);
    //         updatedFormData.append('weight', values.weight);
    //         updatedFormData.append('description', values.description);

    //         console.log(updatedFormData);
    //         // Here you can add the code to send updatedFormData to your backend
    //         const response = await shopServices.addItemRequest(updatedFormData);

    //         console.log(response.data);
    //         if (response.status === 200) {
    //             message.success('Thêm vật phẩm thành công');
    //             form.resetFields();
    //             setHeaderImage([]);
    //             setImages([]);
    //             setIsModalVisible(false);
    //         } else {
    //             message.error('Thêm vật phẩm thất bại');
    //             setIsModalVisible(false);
    //         }
    //     } catch (errorInfo) {
    //         console.log('Validate Failed:', errorInfo);
    //     }
    // };

    // const handleCancel = () => {
    //     setHeaderImage([]);
    //     setImages([]);
    //     setIsModalVisible(false);
    // };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await petServices.getItemSpecies();
    //         if (response.status === 200) {
    //             setListSpecie(response.data);
    //         }
    //     };
    //     fetchData();
    // }, []);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await petServices.getItemAges();
    //         if (response.status === 200) {
    //             setListAge(response.data);
    //         }
    //     };
    //     fetchData();
    // }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h1>Vật phẩm</h1>
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
                    <Button className={cx('btn-add-address')} icon={<PlusOutlined />} onClick={null}>
                        Thêm vật phẩm mới
                    </Button>
                </ConfigProvider>
                {/* <Modal title="Thêm vật phẩm" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
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
                            label="Tên vật phẩm"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên vật phẩm!' }]}
                        >
                            <Input.TextArea
                                autoSize="true"
                                maxLength={200}
                                showCount
                                style={{ marginBottom: '25px' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Giá (VNĐ)"
                            name="price"
                            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                        >
                            <Input.TextArea
                                autoSize="true"
                                maxLength={200}
                                showCount
                                style={{ marginBottom: '25px' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Loại vật phẩm"
                            name="id_pet_specie"
                            rules={[{ required: true, message: 'Vui lòng chọn loại vật phẩm!' }]}
                        >
                            <Select
                                options={listSpecie?.map((specie) => ({
                                    value: specie.id_pet_specie,
                                    label: specie.name,
                                }))}
                            ></Select>
                        </Form.Item>

                        <Form.Item
                            label="Tuổi vật phẩm"
                            name="id_pet_age"
                            rules={[{ required: true, message: 'Vui lòng chọn tuổi vật phẩm!' }]}
                        >
                            <Select
                                options={listAge?.map((age) => ({
                                    value: age.id_pet_age,
                                    label: age.name,
                                }))}
                            ></Select>
                        </Form.Item>

                        <Form.Item
                            label="Cân nặng"
                            name="weight"
                            rules={[{ required: true, message: 'Vui lòng nhập cân nặng vật phẩm!' }]}
                        >
                            <Input.TextArea
                                autoSize="true"
                                maxLength={200}
                                showCount
                                style={{ marginBottom: '25px' }}
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
                </Modal> */}
            </div>
            <Tabs defaultActiveKey="1" items={items} size="large" centered tabBarGutter={340} />
        </div>
    );
}

export default ManagementItem;
