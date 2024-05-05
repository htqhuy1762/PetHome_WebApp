import classNames from 'classnames/bind';
import styles from './SearchPet.module.scss';
import { useLocation } from 'react-router-dom';
import * as searchServices from '~/services/searchServices';
import CardPet from '~/components/CardPet';
import { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import FilterPet from '~/components/Filter/FilterPet';

const cx = classNames.bind(styles);

function SearchPet() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 16;
    const [total, setTotal] = useState(0);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const goToPetDetail = (id) => {
        navigate(`/pets/${id}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!data[currentPage]) {
                const response = await searchServices.searchPets({
                    name: query,
                    limit: limit,
                    start: (currentPage - 1) * limit,
                });
                if (response.status === 200) {
                    setData((prevData) => ({ ...prevData, [currentPage]: response.data.data }));
                    // Đang đợi bên backend xử lý trả về count khi query search
                    setTotal(response.data.count);
                }
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('filter-container')}>
                <FilterPet />
            </div>
            <div className={cx('contents')}>
                <div className={cx('container')}>
                    {data[currentPage]?.map((pet) => (
                        <CardPet key={pet.id_pet} pet={pet} onClick={() => goToPetDetail(pet.id_pet)} />
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
        </div>
    );
}

export default SearchPet;
