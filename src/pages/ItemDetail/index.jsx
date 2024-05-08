import { Button, Image, Pagination, Rate, Avatar, Descriptions, Breadcrumb } from 'antd';
import classNames from 'classnames/bind';
import styles from './ItemDetail.module.scss';
import logo from '../../assets/images/logo.png';
import { ShoppingCartOutlined, WechatOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import * as itemServices from '~/services/itemServices';
import { useState, useEffect, useMemo } from 'react';
import Loading from '~/components/Loading';
import Rating from '~/components/Rating';
import nocomment from '~/assets/images/nocomment.png';
import React from 'react';

const cx = classNames.bind(styles);

function ItemDetail() {
    const { id } = useParams();
    const [itemData, setItemData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 4;
    const [total, setTotal] = useState(0);
    const [dataRating, setDataRating] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const response = await itemServices.getItemDetailById(id);
            if (response.status === 200) {
                setItemData(response.data);
                setTotal(response.data.ratings.rating_count);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            if (!dataRating[currentPage]) {
                const response = await itemServices.getItemRatings(id, {
                    limit: limit,
                    start: (currentPage - 1) * limit,
                });
                if (response.status === 200) {
                    setDataRating((prevData) => ({ ...prevData, [currentPage]: response.data.data }));
                }
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const items = useMemo(() => {
        if (!itemData) {
            return [];
        }

        return [
            {
                key: '1',
                label: 'Địa chỉ',
                children: itemData.shop.data[0].address,
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
    }, [itemData]);

    return itemData ? (
        <div className={cx('wrapper')}>
            <Breadcrumb
                style={{ fontSize: '1.5rem', marginTop: '20px' }}
                items={[
                    {
                        title: <a href="/">Home</a>,
                    },
                    {
                        title: <a href="/items">Items</a>,
                    },
                    {
                        title: (
                            <a style={{ color: 'black' }} href={`/items/${id}`}>
                                {itemData.name}
                            </a>
                        ),
                    },
                ]}
            />
            <div className={cx('item-detail-information')}>
                <div className={cx('item-detail-image')}>
                    <Image style={{ width: '500px', height: '500px' }} src={itemData.picture} alt="" />
                </div>
                <div className={cx('item-detail-info')}>
                    <p style={{ fontSize: '2.5rem', fontWeight: '500', lineHeight: '30px' }}>{itemData.name}</p>
                    <div className={cx('item-detail-info-desc')}>
                        <div className={cx('star-rating')}>
                            <p
                                style={{
                                    textDecoration: 'underline',
                                    marginRight: '5px',
                                    color: 'var(--primary)',
                                    fontSize: '2rem',
                                }}
                            >
                                {itemData.ratings.average_rating}
                            </p>
                            <Rate disabled defaultValue={itemData.ratings.average_rating} />
                        </div>
                        <div className={cx('sold')}>
                            <p>{itemData.ratings.rating_count} Đánh giá</p>
                        </div>
                    </div>
                    <div className={cx('price')}>
                        <p style={{ color: 'red', marginLeft: '20px' }}>{itemData.price.toLocaleString('vi-VN')} đ</p>
                    </div>
                    <div className={cx('item-state', itemData.instock ? 'in-stock' : 'out-of-stock')}>
                        <p>{itemData.instock ? 'Còn hàng' : 'Hết hàng'}</p>
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
            <div className={cx('item-detail-shop')}>
                <div className={cx('item-detail-shop-left')}>
                    <Avatar src={logo} size={100} style={{ border: '1px solid rgb(0, 0, 0, 0.25)' }} />
                    <div className={cx('item-detail-shop-info')}>
                        <p style={{ fontSize: '2rem', marginBottom: '15px' }}>{itemData.shop.name}</p>
                        <Button
                            size="large"
                            style={{ width: '200px', fontSize: '2rem', lineHeight: '1' }}
                            icon={<WechatOutlined />}
                        >
                            Chat ngay
                        </Button>
                    </div>
                </div>
                <div className={cx('item-detail-shop-right')}>
                    <Descriptions layout="horizontal" title="Thông tin shop" items={items} />
                </div>
            </div>
            <div className={cx('item-detail-description')}>
                <h2>Mô tả sản phẩm</h2>
                <div className={cx('item-detail-description-content')}>
                    <p>
                        {itemData.description.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </p>
                </div>
            </div>
            <div
                className={cx('item-detail-rating')}
                style={{ height: dataRating[currentPage] && dataRating[currentPage].length > 0 ? 'auto' : '300px' }}
            >
                <h2 style={{ marginBottom: '20px' }}>Đánh giá sản phẩm</h2>
                {dataRating[currentPage] && dataRating[currentPage].length > 0 ? (
                    <>
                        {dataRating[currentPage].map((rate) => (
                            <Rating key={rate.id_rate} data={rate} />
                        ))}
                        <div className={cx('pagination-container')}>
                            <Pagination
                                className={cx('pagination')}
                                size="medium"
                                defaultPageSize={limit}
                                defaultCurrent={1}
                                total={total}
                                current={currentPage}
                                onChange={handlePageChange}
                            />
                        </div>
                    </>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <img src={nocomment} />
                        <p>Chưa có đánh giá</p>
                    </div>
                )}
            </div>
        </div>
    ) : (
        <Loading />
    );
}

export default ItemDetail;
