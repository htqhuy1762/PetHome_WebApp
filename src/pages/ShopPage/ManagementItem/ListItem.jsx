import classNames from 'classnames/bind';
import styles from './ListItem.module.scss';
import { useState, useEffect } from 'react';
import * as shopServices from '~/services/shopServices';
import CardItemShop from '~/components/CardItemShop';
import { Row, Col, message, Empty, Modal, Form, Input, Button } from 'antd';
import Loading from '~/components/Loading';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
const cx = classNames.bind(styles);

function ListItem() {
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const [itemData, setItemData] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [itemDetails, setItemDetails] = useState([]);
    const [newItemDetail, setNewItemDetail] = useState({ price: '', size: '', quantity: '' });
    const [isModalVisibleDelete, setIsModalVisibleDelete] = useState(false);
    const [isModalVisibleUpdate, setIsModalVisibleUpdate] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editItemDetail, setEditItemDetail] = useState({ price: '', size: '', quantity: '' });
    const [isUpdated, setIsUpdated] = useState(false);

    const successDelete = () => {
        messageApi.open({
            type: 'success',
            content: 'Xóa vật phẩm thành công',
        });
    };

    const errorMessageDelete = () => {
        messageApi.open({
            type: 'error',
            content: 'Xóa vật phẩm thất bại',
        });
    };

    const handleAddItemDetail = async () => {
        try {
            const updatedFormData = new FormData();
            if (newItemDetail.price && newItemDetail.size && newItemDetail.quantity) {
                let itemDetailString = `${newItemDetail.price}^${newItemDetail.size}^${newItemDetail.quantity}`;
                updatedFormData.append('item_detail', itemDetailString);
            }
            const response = await shopServices.addItemDetailRequest(selectedItemId, updatedFormData);

            if (response.status === 200) {
                message.success('Thêm phân loại thành công');
                setItemDetails([...itemDetails, newItemDetail]);
                setNewItemDetail({ price: '', size: '', quantity: '' });
                setIsUpdated(!isUpdated);
            } else {
                message.error('Thêm phân loại thất bại');
            }
        } catch (error) {
            console.log('Failed:', error);
        }
    };

    const handleUpdateItemDetail = async (index, idDetail) => {
        try {
            const updatedFormData = new FormData();
            updatedFormData.append('price', editItemDetail.price);
            updatedFormData.append('quantity', editItemDetail.quantity);
            updatedFormData.append('instock', editItemDetail.quantity > 0 ? 'true' : 'false');

            const response = await shopServices.updateItemDetail(selectedItemId, idDetail, updatedFormData);

            if (response.status === 200) {
                message.success('Cập nhật phân loại thành công');
                const updatedItemDetails = [...itemDetails];
                updatedItemDetails[index] = editItemDetail;
                setItemDetails(updatedItemDetails);
                setEditIndex(null);
                setEditItemDetail({ price: '', size: '', quantity: '' });
                setIsUpdated(!isUpdated);
            } else {
                message.error('Cập nhật phân loại thất bại');
            }
        } catch (error) {
            console.log('Failed:', error);
        }
    };

    const handleEditItemDetail = (index) => {
        setEditIndex(index);
        setEditItemDetail(itemDetails[index]);
    };

    const handleCancelEditItemDetail = () => {
        setEditIndex(null);
        setEditItemDetail({ price: '', size: '', quantity: '' });
    };

    const handleRemoveItemDetail = async (index, idDetail) => {
        try {
            const response = await shopServices.deleteItemDetail(selectedItemId, idDetail);

            if (response.status === 200) {
                message.success('Xóa phân loại thành công');
                const updatedItemDetails = [...itemDetails];
                updatedItemDetails.splice(index, 1);
                setItemDetails(updatedItemDetails);
                setIsUpdated(!isUpdated);
            } else {
                message.error('Xóa phân loại thất bại');
            }
        } catch (error) {
            console.log('Failed:', error);
        }
    };

    useEffect(() => {
        const fetchItemData = async () => {
            setIsLoading(true);
            try {
                const idShop = localStorage.getItem('idShop');
                const response = await shopServices.getShopItems(idShop, { status: 'active' });

                if (response.status === 200) {
                    setItemData(response.data.data || []);
                }
            } catch (error) {
                console.log('Failed to fetch item data: ', error);
            }
            setIsLoading(false);
        };
        fetchItemData();
    }, []);

    const showDeleteConfirm = (idItem) => {
        setSelectedItemId(idItem);
        setIsModalVisibleDelete(true);
    };

    const showUpdateConfirm = (item) => {
        setSelectedItemId(item.id_item);
        setIsModalVisibleUpdate(true);

        setItemDetails(item.details);
    };

    const handleRemoveItem = async () => {
        try {
            const response = await shopServices.deleteShopItem(selectedItemId);
            if (response && response.status === 200) {
                setItemData(itemData.filter((item) => item.id_item !== selectedItemId));
                successDelete();
            } else {
                console.error('Failed to remove item');
                errorMessageDelete();
            }
        } catch (error) {
            console.error('Failed to remove item', error);
        } finally {
            setIsModalVisibleDelete(false);
            setSelectedItemId(null);
        }
    };

    const handleCancelDelete = () => {
        setIsModalVisibleDelete(false);
        setSelectedItemId(null);
    };

    const handleOKUpdate = async () => {
        setIsModalVisibleUpdate(false);
        setSelectedItemId(null);
    };

    const handleCancelUpdate = () => {
        setIsModalVisibleUpdate(false);
        setSelectedItemId(null);
    };

    if (isLoading) {
        return <Loading />;
    }

    if (itemData.length === 0) {
        return (
            <div className={cx('wrapper')}>
                {contextHolder}
                <Empty description="Danh sách trống" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            {contextHolder}
            <Row style={{ marginBottom: 20 }}>
                <Col span={12}>
                    <p style={{ fontSize: '2rem' }}>Vật phẩm</p>
                </Col>
                <Col span={4}>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}>Số tiền</p>
                </Col>
                <Col span={4}>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}>Tình trạng</p>
                </Col>
                <Col span={4}>
                    <p style={{ fontSize: '2rem', textAlign: 'center' }}>Thao tác</p>
                </Col>
            </Row>
            {itemData?.map((item) => (
                <CardItemShop
                    key={item.id_item}
                    item={item}
                    onRemove={showDeleteConfirm}
                    onUpdate={showUpdateConfirm}
                    isUpdated={isUpdated}
                />
            ))}

            <Modal
                title="Xác nhận xóa"
                open={isModalVisibleDelete}
                onOk={handleRemoveItem}
                onCancel={handleCancelDelete}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa vật phẩm này không?</p>
            </Modal>

            <Modal
                title="Chỉnh sửa vật phẩm"
                open={isModalVisibleUpdate}
                onOk={handleOKUpdate}
                onCancel={handleCancelUpdate}
                okText="Xong"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Phân loại vật phẩm">
                        <div>
                            {itemDetails.map((itemDetail, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                    {editIndex === index ? (
                                        <>
                                            <Input
                                                style={{ width: '20%', marginRight: 8 }}
                                                value={editItemDetail.price}
                                                onChange={(e) =>
                                                    setEditItemDetail({ ...editItemDetail, price: e.target.value })
                                                }
                                                placeholder="Giá"
                                            />
                                            <Input
                                                style={{ width: '20%', marginRight: 8 }}
                                                value={editItemDetail.size}
                                                disabled
                                                placeholder="Size"
                                            />
                                            <Input
                                                style={{ width: '20%', marginRight: 8 }}
                                                value={editItemDetail.quantity}
                                                onChange={(e) =>
                                                    setEditItemDetail({ ...editItemDetail, quantity: e.target.value })
                                                }
                                                placeholder="Số lượng"
                                            />
                                            <Button
                                                type="primary"
                                                icon={<CheckOutlined />}
                                                onClick={() => handleUpdateItemDetail(index, itemDetail.id_item_detail)}
                                            />
                                            <Button
                                                type="danger"
                                                icon={<CloseOutlined />}
                                                onClick={handleCancelEditItemDetail}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            {itemDetail.price && (
                                                <div style={{ marginRight: 8 }}>Giá: {itemDetail.price} VND</div>
                                            )}
                                            {itemDetail.size && (
                                                <div style={{ marginRight: 8 }}>Size: {itemDetail.size}</div>
                                            )}
                                            {itemDetail.quantity && (
                                                <div style={{ marginRight: 8 }}>Số lượng: {itemDetail.quantity}</div>
                                            )}
                                            <Button
                                                icon={<EditOutlined />}
                                                onClick={() => handleEditItemDetail(index)}
                                            />
                                            <Button
                                                type="danger"
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleRemoveItemDetail(index, itemDetail.id_item_detail)}
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Form.Item>
                </Form>
                <Form form={form1}>
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
                            onChange={(e) => setNewItemDetail({ ...newItemDetail, quantity: e.target.value })}
                            placeholder="Số lượng"
                        />
                        <Button type="primary" onClick={handleAddItemDetail}>
                            Thêm phân loại
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export default ListItem;
