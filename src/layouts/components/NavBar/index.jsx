import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Navbar.module.scss';
import { Segmented } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faBlog, faBagShopping, faHouseMedical } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, useContext } from 'react';
import { TabContext } from '~/components/TabProvider/index.jsx';

const cx = classNames.bind(styles);

function Navbar() {
    const { setCurrentTab } = useContext(TabContext);
    const [selectedValue, setSelectedValue] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const currentPath = location.pathname.slice(1);
        setSelectedValue(currentPath || 'pets');
    }, [location]);

    return (
        <Segmented
            className={cx('wrapper')}
            value={selectedValue || 'pets'}
            block
            size="medium"
            options={[
                {
                    label: (
                        <div style={{ fontSize: '1.8rem', padding: '3px 0', color: selectedValue === 'pets' ? 'black' : 'white' }}>
                            <FontAwesomeIcon style={{ fontSize: '2rem' }} icon={faPaw} />
                            <div>Thú cưng</div>
                        </div>
                    ),
                    value: 'pets',
                },
                {
                    label: (
                        <div style={{ fontSize: '1.8rem', padding: '3px 0', color: selectedValue === 'items' ? 'black' : 'white' }}>
                            <FontAwesomeIcon style={{ fontSize: '2rem' }} icon={faBagShopping} />
                            <div>Vật phẩm</div>
                        </div>
                    ),
                    value: 'items',
                },
                {
                    label: (
                        <div style={{ fontSize: '1.8rem', padding: '3px 0', color: selectedValue === 'services' ? 'black' : 'white' }}>
                            <FontAwesomeIcon style={{ fontSize: '2rem' }} icon={faHouseMedical} />
                            <div>Dịch vụ</div>
                        </div>
                    ),
                    value: 'services',
                },
                {
                    label: (
                        <div style={{ fontSize: '1.8rem', padding: '3px 0', color: selectedValue === 'blogs' ? 'black' : 'white' }}>
                            <FontAwesomeIcon style={{ fontSize: '2rem' }} icon={faBlog} />
                            <div>Blog</div>
                        </div>
                    ),
                    value: 'blogs',
                },
            ]}
            onChange={(value) => {
                setSelectedValue(value);
                setCurrentTab(value);
                // if (value === 'pets') {
                //     navigate('/');
                // } else {
                //     navigate(`/${value}`);
                // }
                navigate(`/${value}`);
            }}
        />
    );
}

export default Navbar;
