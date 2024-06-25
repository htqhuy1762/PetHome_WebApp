import classNames from 'classnames/bind';
import styles from './CardServiceShop.module.scss';
import { Card, Button, ConfigProvider } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import * as servicePetServices from '~/services/servicePetServices';

const cx = classNames.bind(styles);

function CardServiceShop({ service, onClick, onRemove, onUpdatePrice, onUpdateAddress, isUpdated, onGallery }) {
    const [serviceData, setServiceData] = useState(null);
    const handleButtonClick = (e, callback) => {
        e.stopPropagation();
        callback();
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await servicePetServices.getServiceDetailById(service.id_service);
            if (response.status === 200) {
                setServiceData(response.data);
            }
        };
        fetchData();
    }, [isUpdated]);

    return (
        <Card type="inner" className={cx('card')} onClick={onClick} hoverable>
            <Card.Meta
                title={
                    <p
                        style={{
                            fontSize: '2.7rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {service?.service_name}
                    </p>
                }
                description={
                    <>
                        <p style={{ fontSize: '1.6rem', fontWeight: 500 }}>{service?.areas.join(', ')}</p>
                        <p style={{ fontSize: '1.6rem', fontWeight: 500, color: 'var(--button-next-color)' }}>
                            {service?.min_price.toLocaleString('vi-VN')}đ - {service?.max_price.toLocaleString('vi-VN')}
                            đ
                        </p>
                    </>
                }
            />
            <ConfigProvider
                theme={{
                    components: {
                        Button: {
                            colorPrimary: 'green',
                            colorPrimaryHover: 'green',
                            colorPrimaryActive: 'green',
                            lineWidth: 0,
                        },
                    },
                }}
            >
                <Button
                    icon={<EditOutlined />}
                    style={{ width: 160, marginRight: 10 }}
                    type="primary"
                    onClick={(e) => handleButtonClick(e, () => onUpdatePrice(service))}
                >
                    Chỉnh sửa giá
                </Button>
            </ConfigProvider>

            <Button
                icon={<EditOutlined />}
                style={{ width: 160, marginRight: 10 }}
                type="primary"
                onClick={(e) => handleButtonClick(e, () => onUpdateAddress(serviceData))}
            >
                Chỉnh sửa địa chỉ
            </Button>
            <ConfigProvider
                theme={{
                    components: {
                        Button: {
                            colorPrimary: 'orange',
                            colorPrimaryHover: 'orange',
                            colorPrimaryActive: 'orange',
                            lineWidth: 0,
                        },
                    },
                }}
            >
                <Button
                    icon={<EditOutlined />}
                    style={{ width: 160, marginRight: 10 }}
                    type="primary"
                    onClick={(e) => handleButtonClick(e, () => onGallery(service))}
                >
                    Chỉnh sửa gallery
                </Button>
            </ConfigProvider>

            <Button
                icon={<DeleteOutlined />}
                style={{ width: 160, marginTop: 10, marginLeft: 129}}
                type="primary"
                danger
                onClick={(e) => handleButtonClick(e, () => onRemove(service.id_service))}
            >
                Xóa
            </Button>
        </Card>
    );
}

export default CardServiceShop;
