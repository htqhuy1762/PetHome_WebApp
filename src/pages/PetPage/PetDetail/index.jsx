import {
    Button,
    Image,
    Pagination,
    Rate,
    Avatar,
    Descriptions,
    Breadcrumb,
    Modal,
    Input,
    message,
    Carousel,
    ConfigProvider,
} from 'antd';
import classNames from 'classnames/bind';
import styles from './PetDetail.module.scss';
import { HeartOutlined, WechatOutlined, UserOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import * as petServices from '~/services/petServices';
import * as cartServices from '~/services/cartServices';
import { useState, useEffect, useMemo, useContext } from 'react';
import Loading from '~/components/Loading';
import Rating from '~/components/Rating';
import nocomment from '~/assets/images/nocomment.png';
import React from 'react';
import { ChatContext } from '~/context/ChatProvider';

const cx = classNames.bind(styles);

function PetDetail() {
    const [messageApi, contextHolder] = message.useMessage();
    const { setIdShop } = useContext(ChatContext);

    const handleChatButtonClick = (id) => {
        if (id === localStorage.getItem('idShop')) {
            messageApi.open({
                type: 'error',
                content: 'Xin lỗi, thú cưng này thuộc cửa hàng của bạn!',
            });

            return;
        }
        setIdShop(id);
    };

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

    const cartSuccess = () => {
        messageApi.open({
            type: 'success',
            content: 'Thêm vào mục yêu thích thành công',
        });
    };

    const cartError = () => {
        messageApi.open({
            type: 'error',
            content: 'Thêm vào mục yêu thích thất bại',
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

    useEffect(() => {
        const checkRating = async () => {
            try {
                const response = await petServices.checkRatedOrNot(id);
                if (response.status === 200) {
                    setHasReviewed(response.data.status);
                }
            } catch (error) {
                // Handle error
            }
        };

        checkRating();
    }, [hasReviewed]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleReviewClick = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            if (rating < 1) {
                messageApi.open({
                    type: 'error',
                    content: 'Đánh giá thất bại. Vui lòng chọn số sao (ít nhất là 1)!',
                });
                return;
            }
            // Replace with your actual API call
            await petServices.postPetRating(id, { rate: rating, comment: review });
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

    const handleAddToCart = async (idShop, idPet) => {
        if (idShop === localStorage.getItem('idShop')) {
            messageApi.open({
                type: 'error',
                content: 'Xin lỗi, thú cưng này thuộc cửa hàng của bạn!',
            });
            return;
        }
        try {
            const response = await cartServices.addPetToCart({
                id_pet: idPet,
            });
            if (response.status === 200) {
                cartSuccess();
            } else if (response.status === 400 && response.data.error === 'Pet already in cart') {
                messageApi.open({
                    type: 'error',
                    content: 'Thú cưng này đã có trong mục yêu thích!',
                });
            } else {
                cartError();
            }
        } catch (error) {
            console.error('Exception adding to cart:', error);
            cartError();
        }
    };

    const items = useMemo(() => {
        if (!petData) {
            return [];
        }

        return [
            {
                key: '1',
                label: 'Địa chỉ',
                children: (
                    <>
                        {petData.shop.data.map((address, index) => (
                            <React.Fragment key={index}>
                                • {address.address}
                                <br />
                            </React.Fragment>
                        ))}
                    </>
                ),
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
                    <Carousel
                        style={{ height: '500px', width: '500px' }}
                        autoplay={true}
                        autoplaySpeed={3000}
                        infinite={true}
                        arrows
                    >
                        <Image
                            fallback="data:image/png;base64,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"
                            height={500}
                            width={500}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            src={petData.picture}
                            alt=""
                        />
                        {petData.images.map((image, index) => (
                            <Image
                                fallback="data:image/png;base64,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"
                                height={500}
                                width={500}
                                key={index}
                                style={{ objectFit: 'contain' }}
                                src={image}
                                alt=""
                            />
                        ))}
                    </Carousel>
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
                                {petData.ratings.average_rating.toFixed(1)}
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
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        defaultColor: 'var(--button-next-color)',
                                        defaultBg: 'var(--button-back-color)',
                                        defaultBorderColor: 'var(--button-next-color)',
                                        defaultHoverBorderColor: 'var(--button-next-color)',
                                        defaultHoverBg: 'var(--button-back-color)',
                                        defaultHoverColor: 'var(--button-next-color)',
                                    },
                                },
                            }}
                        >
                            <Button
                                className={cx('button1')}
                                icon={<HeartOutlined />}
                                size="large"
                                onClick={() => handleAddToCart(petData.id_shop, petData.id_pet)}
                                type="default"
                            >
                                Thêm vào mục yêu thích
                            </Button>
                        </ConfigProvider>
                    </div>
                </div>
            </div>
            <div className={cx('pet-detail-shop')}>
                <div className={cx('pet-detail-shop-left')}>
                    <Avatar
                        src={petData.shop?.logo ? petData.shop.logo : null}
                        icon={!petData.shop?.logo ? <UserOutlined /> : null}
                        size={100}
                        style={{ border: '1px solid rgb(0, 0, 0, 0.25)' }}
                    />
                    <div className={cx('pet-detail-shop-info')}>
                        <p style={{ fontSize: '2rem', marginBottom: '15px' }}>{petData.shop.name}</p>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Button: {
                                        defaultColor: 'var(--button-next-color)',
                                        defaultBg: 'var(--button-back-color)',
                                        defaultBorderColor: 'var(--button-next-color)',
                                        defaultHoverBorderColor: 'var(--button-next-color)',
                                        defaultHoverBg: 'var(--button-back-color)',
                                        defaultHoverColor: 'var(--button-next-color)',
                                    },
                                },
                            }}
                        >
                            <Button
                                size="large"
                                style={{ width: '200px', fontSize: '2rem', lineHeight: '1' }}
                                icon={<WechatOutlined />}
                                onClick={() => handleChatButtonClick(petData.id_shop)}
                            >
                                Chat ngay
                            </Button>
                        </ConfigProvider>
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
