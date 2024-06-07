import classNames from 'classnames/bind';
import styles from './CardService.module.scss';
import { Card } from 'antd';

const cx = classNames.bind(styles);

function CardService({ service, onClick }) {
    return (
        <Card type="inner" className={cx('card')} onClick={onClick} hoverable>
            <Card.Meta
                title={<p style={{ fontSize: '2.7rem' }}>{service?.service_name}</p>}
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
        </Card>
    );
}

export default CardService;
