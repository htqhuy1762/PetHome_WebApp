import { useState, useEffect } from 'react';
import { Button, Modal, message, ConfigProvider, Input, Select, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './AddressUser.module.scss';
import AddressCard from '~/components/AddressCard';
import * as userServices from '~/services/userServices';

const cx = classNames.bind(styles);
const areas = [
    'Hà Nội',
    'Hồ Chí Minh',
    'Đà Nẵng',
    'Hải Phòng',
    'Cần Thơ',
    'An Giang',
    'Bà Rịa - Vũng Tàu',
    'Bắc Giang',
    'Bắc Kạn',
    'Bạc Liêu',
    'Bắc Ninh',
    'Bến Tre',
    'Bình Định',
    'Bình Dương',
    'Bình Phước',
    'Bình Thuận',
    'Cà Mau',
    'Cao Bằng',
    'Đắk Lắk',
    'Đắk Nông',
    'Điện Biên',
    'Đồng Nai',
    'Đồng Tháp',
    'Gia Lai',
    'Hà Giang',
    'Hà Nam',
    'Hà Tĩnh',
    'Hải Dương',
    'Hậu Giang',
    'Hòa Bình',
    'Hưng Yên',
    'Khánh Hòa',
    'Kiên Giang',
    'Kon Tum',
    'Lai Châu',
    'Lâm Đồng',
    'Lạng Sơn',
    'Lào Cai',
    'Long An',
    'Nam Định',
    'Nghệ An',
    'Ninh Bình',
    'Ninh Thuận',
    'Phú Thọ',
    'Quảng Bình',
    'Quảng Nam',
    'Quảng Ngãi',
    'Quảng Ninh',
    'Quảng Trị',
    'Sóc Trăng',
    'Sơn La',
    'Tây Ninh',
    'Thái Bình',
    'Thái Nguyên',
    'Thanh Hóa',
    'Thừa Thiên Huế',
    'Tiền Giang',
    'Trà Vinh',
    'Tuyên Quang',
    'Vĩnh Long',
    'Vĩnh Phúc',
    'Yên Bái',
];

function AddressUser() {
    const [addresses, setAddresses] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [addressContent, setAddressContent] = useState('');
    const [areaContent, setAreaContent] = useState('Hà Nội'); // Khởi tạo state với giá trị mặc định

    const areaOptions = areas.map((area) => ({
        value: area,
        label: area,
    }));

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Xóa địa chỉ thành công',
        });
    };

    const errorMessage = () => {
        messageApi.open({
            type: 'error',
            content: 'Xóa địa chỉ thất bại',
        });
    };

    const success1 = () => {
        messageApi.open({
            type: 'success',
            content: 'Thêm địa chỉ thành công',
        });
    };

    const errorMessage1 = () => {
        messageApi.open({
            type: 'error',
            content: 'Thêm địa chỉ thất bại',
        });
    };

    const handleAddAddressClick = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setAddressContent(''); // Làm sạch nội dung sau khi đóng modal
        setAreaContent('Hà Nội'); // Reset area về giá trị mặc định
    };

    const handleOk = async () => {
        try {
            // Replace with your actual API call
            await userServices.addUserAddress({ address: addressContent, area: areaContent });
            setIsModalVisible(false);
            success1();

            // Làm sạch nội dung sau khi thêm địa chỉ
            setAddressContent('');
            setAreaContent('Hà Nội');

            // Refresh the list of addresses
            const response = await userServices.getUserAddress();
            if (response.status === 200) {
                setAddresses(response.data);
            }
        } catch (error) {
            console.error(error);
            errorMessage1();
        }
    };

    const handleChange = (value) => {
        setAreaContent(value);
    };

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await userServices.getUserAddress();
                if (response.status === 200) {
                    setAddresses(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch addresses', error);
                // Handle error
            }
        };

        fetchAddresses();
    }, []);

    const handleRemove = async (id) => {
        try {
            const response = await userServices.deleteUserAddress(id);
            if (response && response.status === 200) {
                success();
                const response = await userServices.getUserAddress();
                if (response.status === 200) {
                    setAddresses(response.data);
                }
            } else {
                console.error('Failed to remove address');
                errorMessage();
            }
        } catch (error) {
            console.error('Failed to remove address', error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            {contextHolder}
            <div className={cx('header')}>
                <h1>Địa chỉ của tôi</h1>
                <ConfigProvider
                    theme={{
                        components: {
                            Button: {
                                defaultColor: 'white',
                                defaultBg: 'var(--button-next-color)',
                                defaultBorderColor: 'var(--button-next-color)',
                                defaultHoverBorderColor: 'var(--button-next-color)',
                                defaultHoverBg: 'var(--button-next-color)',
                                defaultHoverColor: 'white',
                            },
                        },
                    }}
                >
                    <Button className={cx('btn-add-address')} icon={<PlusOutlined />} onClick={handleAddAddressClick}>
                        Thêm địa chỉ mới
                    </Button>
                </ConfigProvider>
                <Modal title="Thêm địa chỉ" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Form layout="vertical">
                        <Form.Item label="Địa chỉ">
                            <Input.TextArea
                                autoSize={{ minRows: 2, maxRows: 6 }}
                                placeholder="Địa chỉ"
                                onChange={(e) => setAddressContent(e.target.value)}
                                value={addressContent}
                                maxLength={200}
                                showCount
                            />
                        </Form.Item>
                        <Form.Item label="Khu vực">
                            <Select
                                value={areaContent}
                                style={{ width: '100%' }}
                                onChange={handleChange}
                                options={areaOptions}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
            <div className={cx('address-list')}>
                {addresses.map((address) => (
                    <AddressCard key={address.id_address} address={address} onRemove={handleRemove} />
                ))}
            </div>
        </div>
    );
}

export default AddressUser;
