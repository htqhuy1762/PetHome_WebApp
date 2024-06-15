import classNames from 'classnames/bind';
import styles from './ListServiceRequest.module.scss';
import { useState, useEffect } from 'react';
import * as shopServices from '~/services/shopServices';
import CardServiceShopRequest from '~/components/CardServiceShopRequest';
import { message, Empty, Modal } from 'antd';
import Loading from '~/components/Loading';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function ListServiceRequest({ idServiceTypeDetail, nameServiceTypeDetail }) {
    const navigate = useNavigate();
    const [serviceData, setServiceData] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Xóa service thành công',
        });
    };

    const errorMessage = () => {
        messageApi.open({
            type: 'error',
            content: 'Xóa service thất bại',
        });
    };

    useEffect(() => {
        const fetchServiceData = async () => {
            setIsLoading(true);
            try {
                const idShop = localStorage.getItem('idShop');
                const response = await shopServices.getShopServices(idShop, {
                    status: 'requested',
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

    const showDeleteConfirm = (idService) => {
        setSelectedServiceId(idService);
        setIsModalVisible(true);
    };

    const handleRemoveService = async () => {
        try {
            const response = await shopServices.deleteShopService(selectedServiceId);
            if (response && response.status === 200) {
                setServiceData(serviceData.filter((service) => service.id_service !== selectedServiceId));
                success();
            } else {
                console.error('Failed to remove service');
                errorMessage();
            }
        } catch (error) {
            console.error('Failed to remove service', error);
            console.log('Error:', error);
        } finally {
            setIsModalVisible(false);
            setSelectedServiceId(null);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
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
                <CardServiceShopRequest
                    key={service.id_service}
                    service={service}
                    onRemove={showDeleteConfirm}
                    onClick={() => navigate(`/services/requested/${service.id_service}`)}
                />
            ))}

            <Modal
                title="Xác nhận xóa"
                open={isModalVisible}
                onOk={handleRemoveService}
                onCancel={handleCancel}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa thú cưng này không?</p>
            </Modal>
        </div>
    );
}

export default ListServiceRequest;
