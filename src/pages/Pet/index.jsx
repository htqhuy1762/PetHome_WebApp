import CardPet from '~/layouts/components/CardPet';
import styles from './Pet.module.scss';
import classNames from 'classnames/bind';
import { Pagination } from 'antd';
import * as petServices from '~/services/petServices';
import { useState, useEffect } from 'react';

const cx = classNames.bind(styles);

function Pet() {
    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 15;
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!data[currentPage]) {
                const response = await petServices.getPets({ limit: limit, start: (currentPage - 1) * limit });
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
                {data[currentPage]?.map((pet) => (
                    <CardPet key={pet.id_pet} pet={pet} />
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

export default Pet;
