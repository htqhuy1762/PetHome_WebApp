import { Button, Image, Pagination, Rate, Avatar, Descriptions, Breadcrumb, Modal, Input, message } from 'antd';
import classNames from 'classnames/bind';
import styles from './PetDetail.module.scss';
import { ShoppingCartOutlined, WechatOutlined, UserOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import * as petServices from '~/services/petServices';
import * as authServices from '~/services/petServices';
import { useState, useEffect, useMemo } from 'react';
import Loading from '~/components/Loading';
import Rating from '~/components/Rating';
import nocomment from '~/assets/images/nocomment.png';
import React from 'react';

const cx = classNames.bind(styles);

function PetDetail() {
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
          type: 'success',
          content: 'Gửi đánh giá thành công',
        });
      };
    
      const errorMessage = () => {
        messageApi.open({
          type: 'error',
          content: 'Gửi đánh giá thất bại',
        });
      };
    const { id } = useParams();
    const [petData, setPetData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 4;
    const [total, setTotal] = useState(0);
    const [dataRating, setDataRating] = useState({});

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [hasReviewed, setHasReviewed] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await petServices.getPetDetailById(id);
            if (response.status === 200) {
                setPetData(response.data);
                setTotal(response.data.ratings.rating_count);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            if (!dataRating[currentPage]) {
                const response = await petServices.getPetRatings(id, {
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

    let token = localStorage.getItem('accessToken');

    useEffect(() => {
        const checkRating = async () => {
            const expiredAt = localStorage.getItem('expiredAt');

            // Check if token exists and is not expired
            if (token && new Date().getTime() < new Date(expiredAt).getTime()) {
                try {
                    const response = await petServices.checkRatedOrNot(id, token);
                    if (response.status === 200) {
                        setHasReviewed(response.data.status);
                    }
                } catch (error) {
                    // Handle error
                }
            } else if (token && new Date().getTime() > new Date(expiredAt).getTime()) {
                // Refresh the token
                const response = await authServices.getNewAccessToken();
                // Save new token and its expiry time to localStorage
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('expiredAt', response.expiredIn);
                token = response.data.accessToken;
            }
        };

        checkRating();
    }, [token, hasReviewed]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleReviewClick = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            // Replace with your actual API call
            await petServices.postPetRating(id, { rate: rating, comment: review }, token);
            setIsModalVisible(false);
            setHasReviewed('rated');
            success();

            // Refresh the list of reviews
            const response = await petServices.getPetRatings(id, {
                limit: limit,
                start: (currentPage - 1) * limit,
            });
            if (response.status === 200) {
                setDataRating((prevData) => ({ ...prevData, [currentPage]: response.data.data }));
            }
        } catch (error) {
            console.error(error);
            errorMessage();
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

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
            {contextHolder}
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
                        title: (
                            <a style={{ color: 'black' }} href={`/pets/${id}`}>
                                {petData.name}
                            </a>
                        ),
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
                    <Avatar
                        src={petData.shop?.avatar ? petData.shop.avatar : null}
                        icon={!petData.shop?.avatar ? <UserOutlined /> : null}
                        size={100}
                        style={{ border: '1px solid rgb(0, 0, 0, 0.25)' }}
                    />
                    <div className={cx('pet-detail-shop-info')}>
                        <p style={{ fontSize: '2rem', marginBottom: '15px' }}>{petData.shop.name}</p>
                        <Button
                            size="large"
                            style={{ width: '200px', fontSize: '2rem', lineHeight: '1' }}
                            icon={<WechatOutlined />}
                        >
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
                    <p>
                        {petData.description.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </p>
                </div>
            </div>
            <div
                className={cx('pet-detail-rating')}
                style={{ height: dataRating[currentPage] && dataRating[currentPage].length > 0 ? 'auto' : '300px' }}
            >
                <div className={cx('header-rating')}>
                    <h2>Đánh giá sản phẩm</h2>
                    {hasReviewed === 'not rated' ? (
                        <Button className={cx('Button-rating')} size="large" onClick={handleReviewClick}>
                            Đánh giá
                        </Button>
                    ) : hasReviewed === 'rated' ? (
                        <div className={cx('rated-text')}>Bạn đã đánh giá sản phẩm!</div>
                    ) : null}

                    <Modal title="Viết đánh giá" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                        <Rate size="large" style={{ margin: '5px 0 20px 0' }} onChange={setRating} value={rating} />
                        <Input.TextArea
                            autoSize="true"
                            placeholder="Viết đánh giá"
                            onChange={(e) => setReview(e.target.value)}
                            value={review}
                            maxLength={200}
                            showCount
                            style={{ marginBottom: '25px' }}
                        />
                    </Modal>
                </div>
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

export default PetDetail;
