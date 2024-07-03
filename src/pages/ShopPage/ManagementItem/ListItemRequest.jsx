import classNames from 'classnames/bind';
import styles from './ListItemRequest.module.scss';
import { useState, useEffect } from 'react';
import * as shopServices from '~/services/shopServices';
import CardItemShopRequest from '~/components/CardItemShopRequest';
import { Row, Col, message, Empty, Modal } from 'antd';
import Loading from '~/components/Loading';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function ListItemRequest({ itemAdded }) {
    const [itemData, setItemData] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Xóa item thành công',
        });
    };

    const errorMessage = () => {
        messageApi.open({
            type: 'error',
            content: 'Xóa item thất bại',
        });
    };

    useEffect(() => {
        const fetchItemData = async () => {
            setIsLoading(true);
            try {
                const idShop = localStorage.getItem('idShop');
                const response = await shopServices.getShopItems(idShop, { status: 'requested' });

                if (response.status === 200) {
                    setItemData(response.data.data || []);
                }
            } catch (error) {
                console.log('Failed to fetch item data: ', error);
            }
            setIsLoading(false);
        };
        fetchItemData();
    }, [itemAdded]);

    const showDeleteConfirm = (idItem) => {
        setSelectedItemId(idItem);
        setIsModalVisible(true);
    };

    const handleRemoveItem = async () => {
        try {
            const response = await shopServices.deleteShopItem(selectedItemId);
            if (response && response.status === 200) {
                setItemData(itemData.filter((item) => item.id_item !== selectedItemId));
                success();
            } else {
                console.error('Failed to remove item');
                errorMessage();
            }
        } catch (error) {
            console.error('Failed to remove item', error);
            console.log('Error:', error);
        } finally {
            setIsModalVisible(false);
            setSelectedItemId(null);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
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
                <Col span={14}>
                    <p style={{ fontSize: '2rem' }}>Vật phẩm</p>
                </Col>
                <Col span={6}>
                    <p style={{ fontSize: '2rem' }}>Số tiền</p>
                </Col>
                <Col span={4}>
                    <p style={{ fontSize: '2rem' }}>Thao tác</p>
                </Col>
            </Row>
            {itemData?.map((item) => (
                <CardItemShopRequest key={item.id_item} item={item} onRemove={showDeleteConfirm} />
            ))}

            <Modal
                title="Xác nhận xóa"
                open={isModalVisible}
                onOk={handleRemoveItem}
                onCancel={handleCancel}
                okText="Xóa"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa vật phẩm này không?</p>
            </Modal>
        </div>
    );
}

ListItemRequest.propTypes = {
    itemAdded: PropTypes.bool,
};

export default ListItemRequest;
