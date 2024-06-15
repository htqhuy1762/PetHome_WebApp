import classNames from 'classnames/bind';
import styles from './ManagementItem.module.scss';
import { Tabs, ConfigProvider, Button, Modal, Input, Upload, message, Form, Select } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import ListItem from './ListItem';
import ListItemRequest from './ListItemRequest';
import { useState, useEffect } from 'react';
import * as shopServices from '~/services/shopServices';
import * as itemServices from '~/services/itemServices';

const cx = classNames.bind(styles);

function ManagementItem() {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [listItemType, setListItemType] = useState([]);
    const [headerImage, setHeaderImage] = useState([]);
    const [images, setImages] = useState([]);
    const [itemDetails, setItemDetails] = useState([]); // State để lưu trữ các phân loại vật phẩm
    const [newItemDetail, setNewItemDetail] = useState({ price: '', size: '', quantity: '' }); // State cho phân loại mới

    const handleAddItemClick = () => {
        setIsModalVisible(true);
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
            label: 'Vật phẩm của bạn',
            children: <ListItem />,
        },
        {
            key: '2',
            label: 'Đang yêu cầu',
            children: <ListItemRequest />,
        },
    ];

    const handleOk = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();

            const updatedFormData = new FormData();
            updatedFormData.append('header_image', headerImage[0]);
            images.forEach((image) => {
                updatedFormData.append('images', image);
            });
            updatedFormData.append('name', values.name);
            updatedFormData.append('unit', values.unit);
            updatedFormData.append('id_item_type_detail', values.id_item_type_detail);
            updatedFormData.append('description', values.description);
            itemDetails.forEach((itemDetail) => {
                // Check if price, size, and quantity are not empty
                if (itemDetail.price && itemDetail.size && itemDetail.quantity) {
                    let itemDetailString = `${itemDetail.price}^${itemDetail.size}^${itemDetail.quantity}`;
                    updatedFormData.append('item_detail', itemDetailString);
                }
            });

            console.log(updatedFormData);
            // Here you can add the code to send updatedFormData to your backend
            const response = await shopServices.addItemRequest(updatedFormData);

            console.log(response.data);
            if (response.status === 200) {
                message.success('Thêm vật phẩm thành công');
                form.resetFields();
                setHeaderImage([]);
                setImages([]);
                setItemDetails([]); // Reset danh sách phân loại sau khi thêm thành công
                setIsModalVisible(false);
            } else {
                message.error('Thêm vật phẩm thất bại');
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

    const handleAddItemDetail = () => {
        setItemDetails([...itemDetails, newItemDetail]);
        setNewItemDetail({ price: '', size: '', quantity: '' });
    };

    const handleRemoveItemDetail = (index) => {
        const updatedItemDetails = [...itemDetails];
        updatedItemDetails.splice(index, 1);
        setItemDetails(updatedItemDetails);
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await itemServices.getItemTypes();
            if (response.status === 200) {
                const sortedData = response.data.sort((a, b) => a.id_item_type - b.id_item_type);
                //console.log(response.data);
                setListItemType(sortedData);
            }
        };
        fetchData();
    }, []);

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
                    <Button className={cx('btn-add-address')} icon={<PlusOutlined />} onClick={handleAddItemClick}>
                        Thêm vật phẩm mới
                    </Button>
                </ConfigProvider>
                <Modal title="Thêm vật phẩm" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
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
                            <Input.TextArea autoSize="true" maxLength={200} showCount />
                        </Form.Item>

                        <Form.Item
                            label="Loại vật phẩm"
                            name="id_item_type_detail"
                            rules={[{ required: true, message: 'Vui lòng chọn loại vật phẩm!' }]}
                        >
                            <Select
                                options={listItemType?.map((itemType) => ({
                                    label: itemType.name,
                                    options: itemType.item_type_detail?.map((itemTypeDetail) => ({
                                        label: itemTypeDetail.name,
                                        value: itemTypeDetail.id_item_type_detail,
                                    })),
                                }))}
                            ></Select>
                        </Form.Item>

                        <Form.Item
                            label="Đơn vị của vật phẩm (cái, túi, g, kg, ...)"
                            name="unit"
                            rules={[{ required: true, message: 'Vui lòng chọn tuổi vật phẩm!' }]}
                        >
                            <Input.TextArea autoSize="true" maxLength={200} showCount />
                        </Form.Item>

                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                        >
                            <Input.TextArea autoSize="true" maxLength={200} showCount />
                        </Form.Item>

                        <Form.Item
                            label="Phân loại vật phẩm"
                            name="item_detail"
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                        >
                            <div>
                                {itemDetails.map((itemDetail, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                        {/* Hiển thị Giá */}
                                        {itemDetail.price && (
                                            <div style={{ marginRight: 8 }}>Giá: {itemDetail.price} VND</div>
                                        )}

                                        {/* Hiển thị Size nếu có */}
                                        {itemDetail.size && (
                                            <div style={{ marginRight: 8 }}>
                                                Size: {itemDetail.size} {form.getFieldValue('unit') || ''}
                                            </div>
                                        )}

                                        {/* Hiển thị Số lượng */}
                                        {itemDetail.quantity && (
                                            <div style={{ marginRight: 8 }}>Số lượng: {itemDetail.quantity}</div>
                                        )}

                                        {/* Button xóa phân loại */}
                                        <Button
                                            type="danger"
                                            icon={<MinusCircleOutlined />}
                                            onClick={() => handleRemoveItemDetail(index)}
                                        />
                                    </div>
                                ))}
                                {/* Input để nhập phân loại mới */}
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                    <Input
                                        style={{ width: '20%', marginRight: 8 }}
                                        value={newItemDetail.price}
                                        onChange={(e) => setNewItemDetail({ ...newItemDetail, price: e.target.value })}
                                        placeholder="Giá"
                                    />
                                    <Input
                                        style={{ width: '20%', marginRight: 8 }}
                                        value={newItemDetail.size}
                                        onChange={(e) => setNewItemDetail({ ...newItemDetail, size: e.target.value })}
                                        placeholder="Size"
                                    />
                                    <Input
                                        style={{ width: '20%', marginRight: 8 }}
                                        value={newItemDetail.quantity}
                                        onChange={(e) =>
                                            setNewItemDetail({ ...newItemDetail, quantity: e.target.value })
                                        }
                                        placeholder="Số lượng"
                                    />
                                    <Button type="primary" onClick={handleAddItemDetail}>
                                        Thêm phân loại
                                    </Button>
                                </div>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            <Tabs defaultActiveKey="1" items={items} size="large" centered tabBarGutter={340} />
        </div>
    );
}

export default ManagementItem;
