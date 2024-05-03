import { Button, Image, Pagination, Rate, Avatar, Descriptions, Breadcrumb } from 'antd';
import classNames from 'classnames/bind';
import styles from './PetDetail.module.scss';
import logo from '../../assets/images/logo.png';
import { ShoppingCartOutlined, WechatOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import * as petServices from '~/services/petServices';
import { useState, useEffect, useMemo } from 'react';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);

function PetDetail() {
    const { id } = useParams();
    const [petData, setPetData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await petServices.getPetDetailById(id);
            if (response.status === 200) {
                setPetData(response.data);
            }
        };

        fetchData();
    }, [id]);

    const items = useMemo(() => {
        if (!petData) {
            return [];
        }

        return [
            {
                key: '1',
                label: 'Địa chỉ',
                children: petData.shop.data[0].address,
            },
            {
                key: '2',
                label: 'Số điện thoại',
                children: '1810000000',
            },
            {
                key: '3',
                label: 'Email',
                children: 'abctest@gmail.com',
            },
        ];
    }, [petData]);

    return petData ? (
        <div className={cx('wrapper')}>
            <Breadcrumb
                style={{ fontSize: '1.5rem', marginTop: '20px' }}
                items={[
                    {
                        title: <a href="/">Home</a>,
                    },
                    {
                        title: <a href="/">Pets</a>,
                    },
                    {
                        title: <a style={{color: 'black'}} href={`/pets/${id}`}>{petData.name}</a>,
                    },
                ]}
            />
            <div className={cx('pet-detail-information')}>
                <div className={cx('pet-detail-image')}>
                    <Image style={{ width: '500px', height: '500px' }} src={petData.picture} alt="" />
                </div>
                <div className={cx('pet-detail-info')}>
                    <p style={{ fontSize: '2.5rem', fontWeight: '500', lineHeight: '30px' }}>{petData.name}</p>
                    <div className={cx('pet-detail-info-desc')}>
                        <div className={cx('star-rating')}>
                            <p
                                style={{
                                    textDecoration: 'underline',
                                    marginRight: '5px',
                                    color: 'var(--primary)',
                                    fontSize: '2rem',
                                }}
                            >
                                {petData.ratings.average_rating}
                            </p>
                            <Rate disabled defaultValue={petData.ratings.average_rating} />
                        </div>
                        <div className={cx('sold')}>
                            <p>{petData.ratings.rating_count} Đánh giá</p>
                        </div>
                    </div>
                    <div className={cx('price')}>
                        <p style={{ color: 'red', marginLeft: '20px' }}>{petData.price.toLocaleString('vi-VN')} đ</p>
                    </div>
                    <div className={cx('pet-state', petData.instock ? 'in-stock' : 'out-of-stock')}>
                        <p>{petData.instock ? 'Còn hàng' : 'Hết hàng'}</p>
                    </div>
                    <div className={cx('list-button')}>
                        <Button className={cx('button1')} icon={<ShoppingCartOutlined />} size="large">
                            Thêm vào giỏ hàng
                        </Button>
                        <Button className={cx('button2')} size="large">
                            Mua ngay
                        </Button>
                    </div>
                </div>
            </div>
            <div className={cx('pet-detail-shop')}>
                <div className={cx('pet-detail-shop-left')}>
                    <Avatar src={logo} size={100} style={{ border: '1px solid rgb(0, 0, 0, 0.25)' }} />
                    <div className={cx('pet-detail-shop-info')}>
                        <p style={{ fontSize: '2rem', marginBottom: '15px' }}>{petData.shop.name}</p>
                        <Button size="large" style={{ width: '200px' }} icon={<WechatOutlined />}>
                            Chat ngay
                        </Button>
                    </div>
                </div>
                <div className={cx('pet-detail-shop-right')}>
                    <Descriptions layout="horizontal" title="Thông tin shop" items={items} />
                </div>
            </div>
            <div className={cx('pet-detail-description')}>
                <h2>Mô tả sản phẩm</h2>
                <div className={cx('pet-detail-description-content')}>
                    <p>{petData.description}</p>
                </div>
            </div>
            <div className={cx('pet-detail-rating')}>
                <h2>Đánh giá sản phẩm</h2>
                <div className={cx('pagination-container')}>
                    <Pagination
                        className={cx('pagination')}
                        size="medium"
                        defaultPageSize={5}
                        defaultCurrent={1}
                        total={10}
                        current={1}
                        onChange={(page) => console.log(page)}
                    />
                </div>
            </div>
        </div>
    ) : (
        <Loading />
    );
}

export default PetDetail;
