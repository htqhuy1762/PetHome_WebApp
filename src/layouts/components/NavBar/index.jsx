import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Navbar.module.scss';
import { Menu, ConfigProvider } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faBlog, faBagShopping, faHouseMedical } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import * as petServices from '~/services/petServices';
import * as itemServices from '~/services/itemServices';


const cx = classNames.bind(styles);

function Navbar() {
    const [items, setItems] = useState([
        {
            label: 'Thú cưng',
            key: 'pets',
            icon: <FontAwesomeIcon style={{ fontSize: '1.6rem' }} icon={faPaw} />,
            theme: 'light',
            children: [],
        },
        {
            label: 'Vật phẩm',
            key: 'items',
            icon: <FontAwesomeIcon style={{ fontSize: '1.6rem' }} icon={faBagShopping} />,
            theme: 'light',
            //children: [],
        },
        {
            label: 'Dịch vụ',
            key: 'services',
            icon: <FontAwesomeIcon style={{ fontSize: '1.6rem' }} icon={faHouseMedical} />,
        },
        {
            label: 'Blog',
            key: 'blogs',
            icon: <FontAwesomeIcon style={{ fontSize: '1.6rem' }} icon={faBlog} />,
        },
    ]);
    const [selectedValue, setSelectedValue] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchPetSpecies = async () => {
            const species = await petServices.getPetSpecies();
            const itemTypes = await itemServices.getItemTypes();
            setItems((prevItems) => {
                const newItems = [...prevItems];
                newItems[0].children = species.data.map((spec) => ({
                    label: spec.name,
                    key: spec.name,
                    onClick: () => {
                        navigate(`/search/pets?q=${spec.name}`);
                    },
                }));
                newItems[0].onTitleClick = ({ key }) => {
                    setSelectedValue(key);
                    navigate(`/${key}`);
                };
                return newItems;
            });
        };

        fetchPetSpecies();

        const currentPath = location.pathname.slice(1);
        setSelectedValue(currentPath || 'pets');
    }, [location]);

    return (
        <div className={cx('wrapper')}>
            <ConfigProvider
                theme={{
                    components: {
                        Menu: {
                            itemSelectedColor: '#7A0303 !important',
                            horizontalItemSelectedColor: '#7A0303',
                        },
                    },
                }}
            >
                <Menu
                    className={cx('wrappermenu')}
                    selectedKeys={[selectedValue || 'pets']}
                    mode="horizontal"
                    onClick={({ key }) => {
                        const isSubmenuItem = items[0].children.some((item) => item.key === key);
                        if (!isSubmenuItem) {
                            setSelectedValue(key);
                            navigate(`/${key}`);
                        }
                    }}
                    items={items}
                />
            </ConfigProvider>
        </div>
    );
}

export default Navbar;
