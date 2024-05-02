import CardItems from '~/components/CardItems';
import styles from './Item.module.scss';
import classNames from 'classnames/bind';
import { Pagination } from 'antd';
import * as itemServices from '~/services/itemServices';
import { useState, useEffect } from 'react';

const cx = classNames.bind(styles);

function Item() {
    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 20;
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!data[currentPage]) {
                const response = await itemServices.getItems({ limit: limit, start: (currentPage - 1) * limit });
                if (response.status === 200) {
                    setData((prevData) => ({ ...prevData, [currentPage]: response.data.data }));
                    setTotal(response.data.count);
                }
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {data[currentPage]?.map((item) => (
                    <CardItems key={item.id_item} item={item} />
                ))}
            </div>
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
        </div>
    );
}

export default Item;
