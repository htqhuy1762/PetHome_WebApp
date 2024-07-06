import { Row, Col, message, Empty } from 'antd';
import classNames from 'classnames/bind';
import styles from './FavoritePet.module.scss';
import PetCartElement from '~/components/PetCartElement';
import * as cartServices from '~/services/cartServices';
import { useState, useEffect } from 'react';
import Loading from '~/components/Loading';
import CartEmpty from '~/assets/images/CartEmpty.png';

const cx = classNames.bind(styles);

function FavoritePet() {
    const [messageApi, contextHolder] = message.useMessage();
    const [pets, setPets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Xóa thú cưng thành công',
        });
    };

    const errorMessage = () => {
        messageApi.open({
            type: 'error',
            content: 'Xóa thú cưng thất bại',
        });
    };
    
    useEffect(() => {
        const fetchPets = async () => {
            setIsLoading(true);
            try {
                const response = await cartServices.getPetsCart();
                if (response.status === 200 && response.data.data) {
                    setPets(response.data.data.map((pet) => ({ ...pet})));
                }
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
        };
        fetchPets();
    }, []);

    const handleRemovePet = async (id) => {
        try {
            const response = await cartServices.removePetFromCart(id);
            if (response && response.status === 200) {
                setPets(pets.filter((pet) => pet.id_pet !== id));
                success();
            } else {
                console.error('Failed to remove pet from cart');
                errorMessage();
            }
        } catch (error) {
            console.error('Failed to remove pet from cart', error);
            console.log('Error:', error);
        }
    };

    if (isLoading) {
        return (
            <div className={cx('wrapper')}>
                <Loading />
            </div>
        );
    }

    if (pets.length === 0) {
        return (
            <div className={cx('wrapper')}>
                {contextHolder}
                <Empty description="Danh sách trống" image={CartEmpty} />
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            {contextHolder}
            <h1>Thú cưng yêu thích</h1>
            <div className={cx('content')}>
                <Row className={cx('header')}>
                    <Col span={12}><p style={{fontSize: '2rem'}}>Thú cưng</p></Col>
                    <Col span={4}><p style={{fontSize: '2rem'}}>Số tiền</p></Col>
                    <Col span={4}><p style={{fontSize: '2rem'}}>Tình trạng</p></Col>
                    <Col span={4}><p style={{fontSize: '2rem'}}>Thao tác</p></Col>
                </Row>
                {pets.map((pet) => (
                    <PetCartElement
                        key={pet.id_pet}
                        pet={pet}
                        onRemove={handleRemovePet}
                    />
                ))}
            </div>
        </div>
    );
}

export default FavoritePet;