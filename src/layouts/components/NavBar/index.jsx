import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Navbar.module.scss';
import { Menu, ConfigProvider, theme } from 'antd';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPaw, faBlog, faBagShopping, faHouseMedical } from '@fortawesome/free-solid-svg-icons';
import { DownOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import * as petServices from '~/services/petServices';
import * as itemServices from '~/services/itemServices';

const cx = classNames.bind(styles);

function Navbar() {
    const [items, setItems] = useState([
        {
            label: <p>THÚ CƯNG <DownOutlined /></p>,
            key: 'pets',
            theme: 'dark',
            children: [],
        },
        {
            label: <p>VẬT PHẨM <DownOutlined /></p>,
            key: 'items',
            theme: 'dark',
            children: [],
        },
        {
            label: 'DỊCH VỤ',
            key: 'services',
        },
        {
            label: 'BLOG',
            key: 'blogs',
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
                newItems[0].children = species.data
                    .sort((a, b) => a.id_pet_specie - b.id_pet_specie)
                    .map((spec) => ({
                        label: spec.name,
                        key: spec.id_pet_specie + 'p',
                        onClick: () => {
                            navigate(`/pets/type/${spec.name}`);
                        },
                    }));
                newItems[0].onTitleClick = ({ key }) => {
                    setSelectedValue(key);
                    navigate(`/${key}`);
                };
                newItems[1].children = itemTypes.data
                    .sort((a, b) => a.id_item_type - b.id_item_type)
                    .map((type) => ({
                        label: type.name,
                        key: type.id_item_type,
                        theme: 'dark',
                        children: type.item_type_detail.map((subType) => ({
                            label: subType.name,
                            key: subType.name,
                            onClick: (event) => {
                                navigate(`/items/type/${subType.name}`);
                                event.stopPropagation();
                            },
                        })),
                    }));
                newItems[1].onTitleClick = ({ key }) => {
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
                            itemColor: 'white',
                            itemHoverColor: 'white',
                            itemSelectedColor: 'white',
                            horizontalItemSelectedColor: 'none', //
                            horizontalItemHoverBg: '#fd4f55', //
                            horizontalItemHoverColor: 'white', //
                            darkItemHoverBg: '#fd4f55', //
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
