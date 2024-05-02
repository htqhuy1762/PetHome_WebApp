import classNames from 'classnames/bind';
import styles from './CardItems.module.scss';
import { Card } from 'antd';

const cx = classNames.bind(styles);

function CardItems({ item }) {
    return (
        <>
            <Card
                className={cx('card')}
                hoverable
                cover={
                    <img
                        style={{
                            width: '220px',
                            height: '220px',
                        }}
                        alt="example"
                        src={item.picture}
                    />
                }
                style={{padding: '0px'}}
            >
                <Card.Meta title={<span>{item.name}</span>} description={item.shop_name} />
                <Card.Meta title={<span style={{ color: 'red' }}>{item.min_price.toLocaleString('vi-VN')}đ</span>} />
            </Card>
        </>
    );
}

export default CardItems;
