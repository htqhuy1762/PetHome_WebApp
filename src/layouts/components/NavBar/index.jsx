import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Navbar.module.scss';
import { Segmented } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faBlog, faBagShopping, faHouseMedical } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Navbar() {
    const [selectedValue, setSelectedValue] = useState('pets');
    const navigate = useNavigate();
    return (
        <Segmented
            className={cx('wrapper')}
            defaultValue={'pets'}
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
                if (value === 'pets') {
                    navigate('/');
                } else {
                    navigate(`/${value}`);
                }
            }}
        />
    );
}

export default Navbar;
