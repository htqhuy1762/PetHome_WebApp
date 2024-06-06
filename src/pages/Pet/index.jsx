import CardPet from '~/components/CardPet';
import styles from './Pet.module.scss';
import classNames from 'classnames/bind';
import { Pagination } from 'antd';
import * as petServices from '~/services/petServices';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '~/components/Loading';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function Pet() {
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get('page');
    const [currentPage, setCurrentPage] = useState(page || 1);
    const limit = 20;
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (!data[currentPage]) {
                const response = await petServices.getPets({ limit: limit, start: (currentPage - 1) * limit });
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
        navigate(`/pets?page=${page}`);
        window.scrollTo(0, 0);
    };

    const goToPetDetail = (id) => {
        navigate(`/pets/${id}`);
    };

    if (loading) {
        return <Loading />; // Replace with your loading component or spinner
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {data[currentPage]?.map((pet) => (
                    <CardPet key={pet.id_pet} pet={pet} onClick={() => goToPetDetail(pet.id_pet)} />
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

export default Pet;
