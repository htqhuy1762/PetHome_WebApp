import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Navbar.module.scss';
import { Segmented} from 'antd';
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
                        <div style={{fontSize: '2rem', color: selectedValue === 'pets' ? 'black' : 'white'}}>
                            <FontAwesomeIcon icon={faPaw} />
                            <div>Thú cưng</div>
                        </div>
                    ),
                    value: 'pets',
                },
                {
                    label: (
                        <div style={{fontSize: '2rem', color: selectedValue === 'items' ? 'black' : 'white'}}>
                            <FontAwesomeIcon icon={faBagShopping} />
                            <div>Vật phẩm</div>
                        </div>
                    ),
                    value: 'items',
                },
                {
                    label: (
                        <div style={{fontSize: '2rem', color: selectedValue === 'services' ? 'black' : 'white'}}>
                            <FontAwesomeIcon icon={faHouseMedical} />
                            <div>Dịch vụ</div>
                        </div>
                    ),
                    value: 'services',
                },
                {
                    label: (
                        <div style={{fontSize: '2rem', color: selectedValue === 'blogs' ? 'black' : 'white'}}>
                            <FontAwesomeIcon icon={faBlog} />
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
