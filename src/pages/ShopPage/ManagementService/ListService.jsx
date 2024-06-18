import classNames from 'classnames/bind';
import styles from './ListService.module.scss';
import { useState, useEffect } from 'react';
import * as shopServices from '~/services/shopServices';
import CardServiceShop from '~/components/CardServiceShop';
import { message, Empty, Modal, Form, InputNumber, Checkbox } from 'antd';
import Loading from '~/components/Loading';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function ListService({ idServiceTypeDetail, nameServiceTypeDetail }) {
    const [form] = Form.useForm();
    const [form1] = Form.useForm();
    const navigate = useNavigate();
    const [serviceData, setServiceData] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisibleDelete, setIsModalVisibleDelete] = useState(false);
    const [isModalVisibleUpdatePrice, setIsModalVisibleUpdatePrice] = useState(false);
    const [isModalVisibleUpdateAddress, setIsModalVisibleUpdateAddress] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    const [selectedServiceName, setSelectedServiceName] = useState(null);
    const [listAddress, setListAddress] = useState([]);
    const [initialAddresses, setInitialAddresses] = useState([]);
    const [isUpdated, setIsUpdated] = useState(false);

    const successDelete = () => {
        messageApi.open({
            type: 'success',
            content: 'Xóa dịch vụ thành công',
        });
    };

    const errorMessageDelete = () => {
        messageApi.open({
            type: 'error',
            content: 'Xóa dịch vụ thất bại',
        });
    };

    const successUpdatePrice = () => {
        messageApi.open({
            type: 'success',
            content: 'Cập nhật giá dịch vụ thành công',
        });
    };

    const errorMessageUpdatePrice = () => {
        messageApi.open({
            type: 'error',
            content: 'Cập nhật giá dịch vụ thất bại',
        });
    };

    const successUpdateAddress = () => {
        messageApi.open({
            type: 'success',
            content: 'Cập nhật địa chỉ dịch vụ thành công',
        });
    };

    const errorMessageUpdateAddress = () => {
        messageApi.open({
            type: 'error',
            content: 'Cập nhật địa chỉ dịch vụ thất bại',
        });
    };

    useEffect(() => {
        const fetchServiceData = async () => {
            setIsLoading(true);
            try {
                const idShop = localStorage.getItem('idShop');
                const response = await shopServices.getShopServices(idShop, {
                    status: 'active',
                    serviceTypeDetailID: idServiceTypeDetail,
                });

                if (response.status === 200) {
                    setServiceData(response.data.data || []);
                }
            } catch (error) {
                console.log('Failed to fetch service data: ', error);
            }
            setIsLoading(false);
        };
        fetchServiceData();
    }, [idServiceTypeDetail]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await shopServices.getShopInfo(localStorage.getItem('idShop'));
            if (response.status === 200) {
                setListAddress(response.data.areas);
            }
        };
        fetchData();
    }, []);

    const showDeleteConfirm = (idService) => {
        setSelectedServiceId(idService);
        setIsModalVisibleDelete(true);
    };

    const showUpdatePriceConfirm = (service) => {
        setSelectedServiceId(service.id_service);
        setIsModalVisibleUpdatePrice(true);
        setSelectedServiceName(service.service_name);

        form.setFieldsValue({
            min_price: service.min_price,
            max_price: service.max_price,
        });
    };

    const showUpdateAddressConfirm = (service) => {
        setSelectedServiceId(service.id_service);
        setIsModalVisibleUpdateAddress(true);

        const initialSelectedAddresses = service.shop.data.map((data) => data.id_address);
        setInitialAddresses(initialSelectedAddresses);

        form1.setFieldsValue({
            addresses: initialSelectedAddresses,
        });
    };

    const handleRemoveService = async () => {
        try {
            const response = await shopServices.deleteShopService(selectedServiceId);
            if (response && response.status === 200) {
                setServiceData(serviceData.filter((service) => service.id_service !== selectedServiceId));
                successDelete();
            } else {
                console.error('Failed to remove service');
                errorMessageDelete();
            }
        } catch (error) {
            console.error('Failed to remove service', error);
            console.log('Error:', error);
        } finally {
            setIsModalVisibleDelete(false);
            setSelectedServiceId(null);
        }
    };

    const handleUpdatePriceService = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();

            const updatedFormData = new FormData();
            updatedFormData.append('min_price', values.min_price);
            updatedFormData.append('max_price', values.max_price);

            const response = await shopServices.updatePriceService(selectedServiceId, updatedFormData);
            if (response && response.status === 200) {
                setServiceData(
                    serviceData.map((service) =>
                        service.id_service === selectedServiceId
                            ? { ...service, min_price: values.min_price, max_price: values.max_price }
                            : service,
                    ),
                );
                successUpdatePrice();
            } else {
                console.error('Failed to update price service');
                errorMessageUpdatePrice();
            }
        } catch (error) {
            console.error('Failed to update price service', error);
            console.log('Error:', error);
        } finally {
            setIsModalVisibleUpdatePrice(false);
            setSelectedServiceId(null);
        }
    };

    const handleUpdateAddressService = async () => {
        try {
            await form1.validateFields();
            const values = form1.getFieldsValue();

            const selectedAddresses = values.addresses;

            const newAddresses = selectedAddresses.filter((address) => !initialAddresses.includes(address));
            const removedAddresses = initialAddresses.filter((address) => !selectedAddresses.includes(address));

            const updatedFormData = new FormData();
            newAddresses.forEach((address) => {
                updatedFormData.append('new_id_address', address);
            });
            removedAddresses.forEach((address) => {
                updatedFormData.append('removed_id_address', address);
            });

            const response = await shopServices.updateAddressService(selectedServiceId, updatedFormData);
            console.log(response);
            if (response && response.status === 200) {
                setServiceData(
                    serviceData.map((service) =>
                        service.id_service === selectedServiceId
                            ? {
                                  ...service,
                                  shop: {
                                      ...service.shop,
                                      data: selectedAddresses.map((id) =>
                                          listAddress.find((addr) => addr.id_address === id),
                                      ),
                                  },
                              }
                            : service,
                    ),
                );
                setIsUpdated(!isUpdated);
                successUpdateAddress();
            } else {
                console.error('Failed to update price service');
                errorMessageUpdateAddress();
            }
        } catch (error) {
            console.error('Failed to update price service', error);
            console.log('Error:', error);
        } finally {
            setIsModalVisibleUpdateAddress(false);
            setSelectedServiceId(null);
        }
    };

    const handleCancelDelete = () => {
        setIsModalVisibleDelete(false);
        setSelectedServiceId(null);
    };

    const handleCancelUpdatePrice = () => {
        setIsModalVisibleUpdatePrice(false);
        setSelectedServiceId(null);
    };

    const handleCancelUpdateAddress = () => {
        setIsModalVisibleUpdateAddress(false);
        setSelectedServiceId(null);
    };

    if (isLoading) {
        return <Loading />;
    }

    if (serviceData.length === 0) {
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
            <h1>{nameServiceTypeDetail}</h1>
            {serviceData?.map((service) => (
                <CardServiceShop
                    key={service.id_service}
                    service={service}
                    onRemove={showDeleteConfirm}
                    onUpdatePrice={showUpdatePriceConfirm}
                    onUpdateAddress={showUpdateAddressConfirm}
                    onClick={() => navigate(`/services/${service.id_service}`)}
                    isUpdated={isUpdated}
                />
            ))}

            <Modal
                title="Xác nhận xóa"
                open={isModalVisibleDelete}
                onOk={handleRemoveService}
                onCancel={handleCancelDelete}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa dịch vụ này không?</p>
            </Modal>

            <Modal
                title="Sửa giá dịch vụ"
                open={isModalVisibleUpdatePrice}
                onOk={handleUpdatePriceService}
                onCancel={handleCancelUpdatePrice}
                okText="Cập nhật"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <h3>{selectedServiceName}</h3>
                    <Form.Item
                        label="Giá thấp nhất"
                        name="min_price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá thấp nhất!' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Giá cao nhất"
                        name="max_price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá cao nhất!' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Sửa địa chỉ cung cấp dịch vụ"
                open={isModalVisibleUpdateAddress}
                onOk={handleUpdateAddressService}
                onCancel={handleCancelUpdateAddress}
                okText="Cập nhật"
                cancelText="Hủy"
            >
                <Form form={form1} layout="vertical">
                    <h3>{selectedServiceName}</h3>
                    <Form.Item
                        label="Danh sách địa chỉ"
                        name="addresses"
                        rules={[{ required: true, message: 'Vui lòng chọn địa chỉ để cập nhật!' }]}
                    >
                        <Checkbox.Group
                            options={listAddress?.map((address) => ({
                                label: address.address,
                                value: address.id_address,
                            }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ListService;
