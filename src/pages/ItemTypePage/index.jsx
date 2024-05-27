import classNames from 'classnames/bind';
import styles from './ItemTypePage.module.scss';
import * as itemServices from '~/services/itemServices';
import CardItems from '~/components/CardItems';
import { useState, useEffect } from 'react';
import { Pagination, Breadcrumb, Empty } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);

function ItemTypePage() {
    const navigate = useNavigate();
    const { type } = useParams();
    const [itemTypes, setItemTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 20;
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchDataItemTypes = async () => {
            const response = await itemServices.getItemTypes();
            if (response.status === 200) {
                setItemTypes(response.data);
            }
        };

        fetchDataItemTypes();
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const goToItemDetail = (id) => {
        navigate(`/items/${id}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (!data[currentPage]) {
                const itemType = itemTypes.find((itemType) =>
                    itemType.item_type_detail.some((detail) => detail.name === type),
                );
                const id_type = itemType?.item_type_detail.find((detail) => detail.name === type)?.id_item_type_detail;
                if (id_type) {
                    const response = await itemServices.getItems({
                        limit: limit,
                        start: (currentPage - 1) * limit,
                        detailTypeID: id_type,
                    });

                    if (response.status === 200) {
                        setData((prevData) => ({ ...prevData, [currentPage]: response.data.data }));
                        setTotal(response.data.count);
                    }
                }
            }
            setLoading(false);
        };
        if (itemTypes.length > 0) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, itemTypes]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={cx('wrapper')}>
            <Breadcrumb className={cx('breadcrumb')}>
                <Breadcrumb.Item>
                    <a href="/">Trang chủ</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/items">Vật phẩm</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{type}</Breadcrumb.Item>
            </Breadcrumb>
            <div className={cx('contents')}>
                <div className={cx('container')}>
                    {data[currentPage]?.length > 0 ? (
                        data[currentPage].map((item) => (
                            <CardItems key={item.id_item} item={item} onClick={() => goToItemDetail(item.id_item)} />
                        ))
                    ) : (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '366px',
                            }}
                        >
                            <Empty description="Danh sách trống" />
                        </div>
                    )}
                </div>
                {data[currentPage]?.length > 0 && (
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
                )}
            </div>
        </div>
    );
}

export default ItemTypePage;
