import classNames from 'classnames/bind';
import styles from './ListPet.module.scss';
import { useState, useEffect } from 'react';
import * as shopServices from '~/services/shopServices';
import CardPetShop from '~/components/CardPetShop';
import { Row, Col, message, Empty, Modal, Form, InputNumber, Radio } from 'antd';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);

function ListPet() {
    const [form] = Form.useForm(); // Sử dụng form hook để quản lý form state

    const [petData, setPetData] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisibleDelete, setIsModalVisibleDelete] = useState(false);
    const [isModalVisibleUpdate, setIsModalVisibleUpdate] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState(null);
    const [selectedPetName, setSelectedPetName] = useState(null);

    const successDelete = () => {
        messageApi.open({
            type: 'success',
            content: 'Xóa pet thành công',
        });
    };

    const errorMessageDelete = () => {
        messageApi.open({
            type: 'error',
            content: 'Xóa pet thất bại',
        });
    };

    const successUpdate = () => {
        messageApi.open({
            type: 'success',
            content: 'Cập nhật pet thành công',
        });
    };

    const errorMessageUpdate = () => {
        messageApi.open({
            type: 'error',
            content: 'Cập nhật pet thất bại',
        });
    };

    useEffect(() => {
        const fetchPetData = async () => {
            setIsLoading(true);
            try {
                const idShop = localStorage.getItem('idShop');
                const response = await shopServices.getShopPets(idShop, { status: 'active' });

                if (response.status === 200) {
                    setPetData(response.data.data || []);
                }
            } catch (error) {
                console.log('Failed to fetch pet data: ', error);
            }
            setIsLoading(false);
        };
        fetchPetData();
    }, []);

    const showDeleteConfirm = (idPet) => {
        setSelectedPetId(idPet);
        setIsModalVisibleDelete(true);
    };

    const showUpdateConfirm = (pet) => {
        setIsModalVisibleUpdate(true);
        setSelectedPetId(pet.id_pet);
        setSelectedPetName(pet.name)

        // Đặt giá trị mặc định cho form khi modal được mở
        form.setFieldsValue({
            price: pet.price, // Đặt giá trị cho InputNumber
            instock: pet.instock, // Đặt giá trị cho Radio.Group
        });
    };

    const handleRemovePet = async () => {
        try {
            const response = await shopServices.deleteShopPet(selectedPetId);
            if (response && response.status === 200) {
                setPetData(petData.filter((pet) => pet.id_pet !== selectedPetId));
                successDelete();
            } else {
                console.error('Failed to remove pet');
                errorMessageDelete();
            }
        } catch (error) {
            console.error('Failed to remove pet', error);
            console.log('Error:', error);
        } finally {
            setIsModalVisibleDelete(false);
            setSelectedPetId(null);
        }
    };

    const handleUpdatePet = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();

            const updatedFormData = new FormData();
            updatedFormData.append('price', values.price);
            updatedFormData.append('instock', values.instock);

            const response = await shopServices.updateShopPet(selectedPetId, updatedFormData);
            if (response && response.status === 200) {
                // Cập nhật lại petData sau khi cập nhật thành công
                setPetData(
                    petData.map((pet) =>
                        pet.id_pet === selectedPetId ? { ...pet, price: values.price, instock: values.instock } : pet
                    )
                );
                successUpdate();
            } else {
                console.error('Failed to update pet');
                errorMessageUpdate();
            }
        } catch (error) {
            console.error('Failed to update pet', error);
            console.log('Error:', error);
        } finally {
            setIsModalVisibleUpdate(false);
            setSelectedPetId(null);
        }
    };

    const handleCancelDelete = () => {
        setIsModalVisibleDelete(false);
        setSelectedPetId(null);
    };

    const handleCancelUpdate = () => {
        setIsModalVisibleUpdate(false);
        setSelectedPetId(null);
    };

    if (isLoading) {
        return <Loading />;
    }

    if (petData.length === 0) {
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
                    <p style={{ fontSize: '2rem' }}>Thú cưng</p>
                </Col>
                <Col span={4}>
                    <p style={{ fontSize: '2rem' }}>Số tiền</p>
                </Col>
                <Col span={4}>
                    <p style={{ fontSize: '2rem' }}>Tình trạng</p>
                </Col>
                <Col span={4}>
                    <p style={{ fontSize: '2rem' }}>Thao tác</p>
                </Col>
            </Row>
            {petData?.map((pet) => (
                <CardPetShop key={pet.id_pet} pet={pet} onRemove={showDeleteConfirm} onUpdate={showUpdateConfirm} />
            ))}

            <Modal
                title="Xác nhận xóa"
                open={isModalVisibleDelete}
                onOk={handleRemovePet}
                onCancel={handleCancelDelete}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa thú cưng này không?</p>
            </Modal>

            <Modal
                title="Sửa thú cưng"
                open={isModalVisibleUpdate}
                onOk={handleUpdatePet}
                onCancel={handleCancelUpdate}
                okText="Cập nhật"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <h3>{selectedPetName}</h3>
                    <Form.Item
                        label="Giá thú cưng"
                        name="price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Tình trạng thú cưng"
                        name="instock"
                        rules={[{ required: true, message: 'Vui lòng chọn loại thú cưng!' }]}
                    >
                        <Radio.Group>
                            <Radio value={true}>Còn hàng</Radio>
                            <Radio value={false}>Hết hàng</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ListPet;