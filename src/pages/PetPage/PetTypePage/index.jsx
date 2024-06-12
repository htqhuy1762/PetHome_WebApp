import classNames from 'classnames/bind';
import styles from './PetTypePage.module.scss';
import * as petServices from '~/services/petServices';
import CardPet from '~/components/CardPet';
import { useState, useEffect } from 'react';
import { Pagination, Empty, Breadcrumb } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);

function PetTypePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { type } = useParams();
    const [species, setSpecies] = useState([]);

    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 20;
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchDataSpecies = async () => {
            const response = await petServices.getPetSpecies();
            if (response.status === 200) {
                setSpecies(response.data);
            }
        };

        fetchDataSpecies();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (!data[currentPage]) {
                const id_type = species.find((species) => species.name === type)?.id_pet_specie;
                if (id_type) {
                    const response = await petServices.getPets({
                        limit: limit,
                        start: (currentPage - 1) * limit,
                        specieID: id_type,
                    });

                    if (response.status === 200) {
                        setData((prevData) => ({ ...prevData, [currentPage]: response.data.data }));
                        setTotal(response.data.count);
                    }
                }
            }
            setLoading(false);
        };
        if (species.length > 0) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, species]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const goToPetDetail = (id) => {
        navigate(`/pets/${id}`);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={cx('wrapper')}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>
                    <a href="/">Trang chủ</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <a href="/pets">Thú cưng</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{type}</Breadcrumb.Item>
            </Breadcrumb>
            <div className={cx('contents')}>
                <div className={cx('container')}>
                    {data[currentPage]?.length > 0 ? (
                        data[currentPage].map((pet) => (
                            <CardPet key={pet.id_pet} pet={pet} onClick={() => goToPetDetail(pet.id_pet)} />
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

export default PetTypePage;
