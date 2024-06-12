import classNames from 'classnames/bind';
import styles from './ListPet.module.scss';
import { useState, useEffect } from 'react';
import * as shopServices from '~/services/shopServices';
import CardPetShop from '~/components/CardPetShop';
import { Row, Col } from 'antd';

const cx = classNames.bind(styles);

function ListPet() {
    const [petData, setPetData] = useState(null);

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                const idShop = localStorage.getItem('idShop');
                const response = await shopServices.getShopPets(idShop);

                if (response.status === 200) {
                    setPetData(response.data.data);
                }
            } catch (error) {
                console.log('Failed to fetch pet data: ', error);
            }
        };
        fetchPetData();
    }, []);

    const handleRemovePet = async (idPet) => {
        console.log('Remove pet: ', idPet);
    };

    return (
        <div className={cx('wrapper')}>
            <Row style={{marginBottom: 20}}>
                <Col span={12}>
                    <p style={{ fontSize: '2rem' }}>Thú cưng</p>
                </Col>
                <Col span={4}>
                    <p style={{ fontSize: '2rem' }}>Số tiền</p>
                </Col>
                <Col span={4}>
                    <p style={{ fontSize: '2rem' }}>Tình trạng</p>
                </Col>
                <Col span={4}>
                    <p style={{ fontSize: '2rem' }}>Thao tác</p>
                </Col>
            </Row>
            {petData?.map((pet) => (
                <CardPetShop
                    key={pet.id_pet}
                    pet={pet}
                    onRemove={handleRemovePet}
                />
            ))}
        </div>
    );
}

export default ListPet;
