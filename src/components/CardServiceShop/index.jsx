import classNames from 'classnames/bind';
import styles from './CardServiceShop.module.scss';
import { Card, Button } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function CardServiceShop({ service, onClick, onRemove }) {
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
            <Button
                icon={<EditOutlined />}
                style={{ width: 115, marginRight: 10}}
                type="primary"
                onClick={() => onRemove(service.id_service)}
            >
                Chỉnh sửa
            </Button>
            <Button
                icon={<DeleteOutlined />}
                style={{ width: 115, marginTop: 10 }}
                type="primary"
                danger
                onClick={() => onRemove(service.id_service)}
            >
                Xóa
            </Button>
        </Card>
    );
}

export default CardServiceShop;
