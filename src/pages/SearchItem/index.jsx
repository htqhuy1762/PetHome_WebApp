import classNames from 'classnames/bind';
import styles from './SearchItem.module.scss';
import { useLocation } from 'react-router-dom';
import * as searchServices from '~/services/searchServices';
import CardItems from '~/components/CardItems';
import { useState, useEffect } from 'react';
import { Pagination, Checkbox, Button, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
const provinces = [
    { id: 1, name: 'Hải Phòng' },
    { id: 2, name: 'Hà Nội' },
    { id: 3, name: 'Đà Nẵng' },
    { id: 4, name: 'Hồ Chí Minh' },
    { id: 5, name: 'Cần Thơ' },
    { id: 6, name: 'An Giang' },
    { id: 7, name: 'Bà Rịa - Vũng Tàu' },
    { id: 8, name: 'Bắc Giang' },
    { id: 9, name: 'Bắc Kạn' },
    { id: 10, name: 'Bạc Liêu' },
    { id: 11, name: 'Bắc Ninh' },
    { id: 12, name: 'Bến Tre' },
    { id: 13, name: 'Bình Định' },
    { id: 14, name: 'Bình Dương' },
    { id: 15, name: 'Bình Phước' },
    { id: 16, name: 'Bình Thuận' },
    { id: 17, name: 'Cà Mau' },
    { id: 18, name: 'Cao Bằng' },
    { id: 19, name: 'Đắk Lắk' },
    { id: 20, name: 'Đắk Nông' },
    { id: 21, name: 'Điện Biên' },
    { id: 22, name: 'Đồng Nai' },
    { id: 23, name: 'Đồng Tháp' },
    { id: 24, name: 'Gia Lai' },
    { id: 25, name: 'Hà Giang' },
    { id: 26, name: 'Hà Nam' },
    { id: 27, name: 'Hà Tĩnh' },
    { id: 28, name: 'Hải Dương' },
    { id: 29, name: 'Hậu Giang' },
    { id: 30, name: 'Hòa Bình' },
    { id: 31, name: 'Hưng Yên' },
    { id: 32, name: 'Khánh Hòa' },
    { id: 33, name: 'Kiên Giang' },
    { id: 34, name: 'Kon Tum' },
    { id: 35, name: 'Lai Châu' },
    { id: 36, name: 'Lâm Đồng' },
    { id: 37, name: 'Lạng Sơn' },
    { id: 38, name: 'Lào Cai' },
    { id: 39, name: 'Long An' },
    { id: 40, name: 'Nam Định' },
    { id: 41, name: 'Nghệ An' },
    { id: 42, name: 'Ninh Bình' },
    { id: 43, name: 'Ninh Thuận' },
    { id: 44, name: 'Phú Thọ' },
    { id: 45, name: 'Phú Yên' },
    { id: 46, name: 'Quảng Bình' },
    { id: 47, name: 'Quảng Nam' },
    { id: 48, name: 'Quảng Ngãi' },
    { id: 49, name: 'Quảng Ninh' },
    { id: 50, name: 'Quảng Trị' },
    { id: 51, name: 'Sóc Trăng' },
    { id: 52, name: 'Sơn La' },
    { id: 53, name: 'Tây Ninh' },
    { id: 54, name: 'Thái Bình' },
    { id: 55, name: 'Thái Nguyên' },
    { id: 56, name: 'Thanh Hóa' },
    { id: 57, name: 'Thừa Thiên Huế' },
    { id: 58, name: 'Tiền Giang' },
    { id: 59, name: 'Trà Vinh' },
    { id: 60, name: 'Tuyên Quang' },
    { id: 61, name: 'Vĩnh Long' },
    { id: 62, name: 'Vĩnh Phúc' },
    { id: 63, name: 'Yên Bái' },
];

function SearchItem() {
    const navigate = useNavigate();
    const location = useLocation();
    const [displayCount, setDisplayCount] = useState(5);
    const [isExpanded, setIsExpanded] = useState(false);

    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 16;
    const [total, setTotal] = useState(0);
    const [lastQuery, setLastQuery] = useState(null);

    const [selectedProvinces, setSelectedProvinces] = useState([]);

    const handleProvincesChange = (checkedValues) => {
        setSelectedProvinces(checkedValues);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const goToItemDetail = (id) => {
        navigate(`/items/${id}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            const query = new URLSearchParams(location.search).get('q');
            if (query !== lastQuery || !data[currentPage]) {
                const response = await searchServices.searchItems({
                    name: query,
                    limit: limit,
                    start: (currentPage - 1) * limit,
                });
                if (response.status === 200) {
                    setData((prevData) => ({ ...prevData, [currentPage]: response.data.data }));
                    // Đang đợi bên backend xử lý trả về count khi query search
                    setTotal(response.data.count);
                    setLastQuery(query);
                }
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, location.search]);

    const filteredData = data[currentPage]?.filter(
        (item) => selectedProvinces.length === 0 || item.areas.some((area) => selectedProvinces.includes(area)),
    );

    const handleExpandClick = () => {
        if (isExpanded) {
            setDisplayCount(5); // if expanded, collapse to show 5 provinces
        } else {
            setDisplayCount(provinces.length); // if collapsed, expand to show all provinces
        }
        setIsExpanded(!isExpanded); // toggle expanded state
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('filter-container')}>
                <div className={cx('filter-wrapper')}>
                    <div className={cx('header')}>
                        <FontAwesomeIcon style={{ fontSize: '2rem' }} icon={faFilter} />
                        <span style={{ marginLeft: '4px' }}>BỘ LỌC TÌM KIẾM</span>
                    </div>
                    <div className={cx('content')}>
                        <div>
                            <div style={{ marginTop: '20px' }}>
                                <h3>Khu vực</h3>
                                <Checkbox.Group onChange={handleProvincesChange}>
                                    {provinces.slice(0, displayCount).map((item, index) => (
                                        <Checkbox key={index} value={item.name}>
                                            {item.name}
                                        </Checkbox>
                                    ))}
                                </Checkbox.Group>
                                <Button
                                    style={{ color: 'var(--start-color)', fontWeight: '700', marginTop: '10px' }}
                                    type="text"
                                    onClick={handleExpandClick}
                                >
                                    {isExpanded ? 'Thu gọn' : 'Mở rộng'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('contents')}>
                <div className={cx('container')}>
                    {filteredData?.length > 0 ? (
                        filteredData.map((item) => (
                            <CardItems key={item.id_item} item={item} onClick={() => goToItemDetail(item.id_item)} />
                        ))
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', width: '965px' }}>
                            <Empty description="Danh sách trống" />
                        </div>
                    )}
                </div>
                {filteredData?.length > 0 && (
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

export default SearchItem;
