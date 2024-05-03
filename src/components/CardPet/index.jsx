import classNames from 'classnames/bind';
import styles from './CardPet.module.scss';
import { Card } from 'antd';

const cx = classNames.bind(styles);

function CardPet({ pet, onClick }) {
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
                        src={pet.picture}
                    />
                }
                style={{padding: '0px'}}
                onClick={onClick}
            >
                <Card.Meta title={<span>{pet.name}</span>} description={pet.shop_name} />
                <Card.Meta title={<span style={{ color: 'red' }}>{pet.price.toLocaleString('vi-VN')}đ</span>} />
            </Card>
        </>
    );
}

export default CardPet;
