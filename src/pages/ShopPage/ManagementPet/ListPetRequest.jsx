import classNames from 'classnames/bind';
import styles from './ListPetRequest.module.scss';
import { useState, useEffect } from 'react';
import * as shopServices from '~/services/shopServices';
import CardPetShopRequest from '~/components/CardPetShopRequest';
import { Row, Col, message, Empty, Modal } from 'antd';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);

function ListPetRequest() {
    const [petData, setPetData] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState(null);

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Xóa pet thành công',
        });
    };

    const errorMessage = () => {
        messageApi.open({
            type: 'error',
            content: 'Xóa pet thất bại',
        });
    };

    useEffect(() => {
        const fetchPetData = async () => {
            setIsLoading(true);
            try {
                const idShop = localStorage.getItem('idShop');
                const response = await shopServices.getShopPets(idShop, { status: 'requested' });

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
        setIsModalVisible(true);
    };

    const handleRemovePet = async () => {
        try {
            const response = await shopServices.deleteShopPet(selectedPetId);
            if (response && response.status === 200) {
                setPetData(petData.filter((pet) => pet.id_pet !== selectedPetId));
                success();
            } else {
                console.error('Failed to remove pet');
                errorMessage();
            }
        } catch (error) {
            console.error('Failed to remove pet', error);
            console.log('Error:', error);
        } finally {
            setIsModalVisible(false);
            setSelectedPetId(null);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
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
                <Col span={14}>
                    <p style={{ fontSize: '2rem' }}>Thú cưng</p>
                </Col>
                <Col span={6}>
                    <p style={{ fontSize: '2rem' }}>Số tiền</p>
                </Col>
                <Col span={4}>
                    <p style={{ fontSize: '2rem' }}>Thao tác</p>
                </Col>
            </Row>
            {petData?.map((pet) => (
                <CardPetShopRequest key={pet.id_pet} pet={pet} onRemove={showDeleteConfirm} />
            ))}

            <Modal
                title="Xác nhận xóa"
                open={isModalVisible}
                onOk={handleRemovePet}
                onCancel={handleCancel}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa thú cưng này không?</p>
            </Modal>
        </div>
    );
}

export default ListPetRequest;
