import classNames from 'classnames/bind';
import styles from './ServicePet.module.scss';
import { useState, useEffect } from 'react';
import * as servicePetServices from '~/services/servicePetServices';
import { Menu, Pagination, Empty } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import Loading from '~/components/Loading';
import CardService from '~/components/CardService';

const cx = classNames.bind(styles);

function ServicePet() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingServices, setLoadingServices] = useState(false);
    const [services, setServices] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const limit = 7;
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get('page');
    const name = searchParams.get('name');
    const [currentPage, setCurrentPage] = useState(page ? parseInt(page, 10) : 1);
    const [currentName, setCurrentName] = useState(name || '');
    const [currentId, setCurrentId] = useState(null);
    const [total, setTotal] = useState(0);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const fetchServices = async (id, page = 1) => {
        setLoadingServices(true);
        if (id !== null) {
            try {
                const response = await servicePetServices.getAllServicesByType({
                    serviceTypeDetailID: id,
                    limit: limit,
                    start: (page - 1) * limit,
                });
                if (response.status === 200) {
                    console.log(response.data);
                    setServices(response.data.data);
                    setTotal(response.data.count);
                } else {
                    setServices([]);
                    setTotal(0);
                }
            } catch (error) {
                console.error('Failed to fetch services', error);
                setServices([]);
                setTotal(0);
            }
        } else {
            setServices([]);
            setTotal(0);
        }
        setLoadingServices(false);
    };

    useEffect(() => {
        const fetchServiceTypes = async () => {
            try {
                const response = await servicePetServices.getServiceTypes();
                if (response.status === 200) {
                    let types = response.data;

                    // Sort types by id_service_type
                    types = types.sort((a, b) => a.id_service_type - b.id_service_type);

                    // Fetch details for each service type
                    const detailsPromises = types.map((type) =>
                        servicePetServices.getServiceTypeDetail(type.id_service_type),
                    );
                    const detailsResponses = await Promise.all(detailsPromises);

                    const newItems = types.map((type, index) => {
                        let details = detailsResponses[index].data;
                        if (detailsResponses[index].status === 200) {
                            // Sort details by id_service_type_detail
                            details = details.sort((a, b) => a.id_service_type_detail - b.id_service_type_detail);
                        }

                        return {
                            key: `type-${type.id_service_type}`,
                            label: type.name,
                            children: details.map((detail) => ({
                                key: `type-${type.id_service_type}-detail-${detail.id_service_type_detail}`,
                                label: detail.name,
                                onClick: () => {
                                    setCurrentName(detail.name);
                                    setCurrentPage(1);
                                    setCurrentId(detail.id_service_type_detail);
                                    navigate(`/services?name=${detail.name}&page=1`);
                                },
                            })),
                        };
                    });

                    setItems(newItems);

                    // Fetch services if name is set in the URL
                    if (name) {
                        const selectedDetail = newItems
                            .flatMap((item) => item.children)
                            .find((child) => child.label === name);
                        if (selectedDetail) {
                            const detailId = selectedDetail.key.split('-detail-')[1];
                            setCurrentId(detailId);
                            fetchServices(detailId, currentPage);
                            setSelectedKeys([selectedDetail.key]);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch service types or details', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceTypes();
    }, []);

    useEffect(() => {
        const newPage = parseInt(searchParams.get('page'), 10) || 1;
        const newName = searchParams.get('name') || '';

        setCurrentPage(newPage);
        setCurrentName(newName);

        const selectedDetail = items.flatMap((item) => item.children).find((child) => child.label === newName);
        if (selectedDetail) {
            const detailId = selectedDetail.key.split('-detail-')[1];
            setCurrentId(detailId);
            fetchServices(detailId, newPage);
            setSelectedKeys([selectedDetail.key]);
        }
    }, [location]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchServices(currentId, page);
        navigate(`/services?name=${currentName}&page=${page}`);
        window.scrollTo(0, 0);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('sidebar')}>
                {/* {loading ? (
                    <Loading />
                ) : (
                    <Menu
                        style={{ width: 256 }}
                        defaultOpenKeys={items.map((item) => item.key)}
                        mode="inline"
                        items={items}
                        selectedKeys={selectedKeys}
                    />
                )} */}
                <Menu
                    style={{ width: 256 }}
                    defaultOpenKeys={items.map((item) => item.key)}
                    mode="inline"
                    items={items}
                    selectedKeys={selectedKeys}
                />
            </div>
            <div className={cx('content')}>
                {loadingServices ? (
                    <Loading />
                ) : (
                    <>
                        {services && services.length > 0 ? (
                            <>
                                {services.map((service) => (
                                    <CardService
                                        key={service.id_service}
                                        service={service}
                                        onClick={() => navigate(`/services/${service.id_service}`)}
                                    />
                                ))}
                                <Pagination
                                    style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
                                    showSizeChanger={false}
                                    className={cx('pagination')}
                                    size="medium"
                                    defaultPageSize={limit}
                                    defaultCurrent={1}
                                    total={total}
                                    current={currentPage}
                                    onChange={handlePageChange}
                                />
                            </>
                        ) : (
                            <Empty
                                description="Danh sách dịch vụ trống, vui lòng chọn loại dịch vụ!"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            ></Empty>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ServicePet;
