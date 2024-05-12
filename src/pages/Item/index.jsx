import CardItems from '~/components/CardItems';
import styles from './Item.module.scss';
import classNames from 'classnames/bind';
import { Pagination, Carousel } from 'antd';
import * as itemServices from '~/services/itemServices';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);

function Item() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 20;
    const [total, setTotal] = useState(0);
    const contentStyle = {
        margin: 0,
        height: '300px',
        color: '#fff',
        lineHeight: '300px',
        textAlign: 'center',
        background: '#364d79',
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (!data[currentPage]) {
                const response = await itemServices.getItems({ limit: limit, start: (currentPage - 1) * limit });
                if (response.status === 200) {
                    setData((prevData) => ({ ...prevData, [currentPage]: response.data.data }));
                    setTotal(response.data.count);
                }
            }
            setLoading(false);
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const goToItemDetail = (id) => {
        navigate(`/items/${id}`);
    };

    if (loading) {
        return <Loading />; // Replace with your loading component or spinner
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('carousel-container')}>
                <Carousel autoplay={true} autoplaySpeed={5000} arrows infinite={true}>
                    <div>
                        <h3 style={contentStyle}>1</h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>2</h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>3</h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>4</h3>
                    </div>
                </Carousel>
            </div>
            <div className={cx('sales-item-container')}>
                <div className={cx('sales-header')}>
                    <h2>Flash sale</h2>
                </div>
                <div className={cx('content')}>

                </div>
            </div>
            <div className={cx('container')}>
                {data[currentPage]?.map((item) => (
                    <CardItems key={item.id_item} item={item} onClick={() => goToItemDetail(item.id_item)} />
                ))}
            </div>
            <div className={cx('pagination-container')}>
                <Pagination
                    showSizeChanger={false}
                    className={cx('pagination')}
                    size="medium"
                    defaultPageSize={limit}
                    defaultCurrent={1}
                    total={total}
                    current={currentPage}
                    onChange={handlePageChange}
                />
            </div>
        </div>
    );
}

export default Item;
