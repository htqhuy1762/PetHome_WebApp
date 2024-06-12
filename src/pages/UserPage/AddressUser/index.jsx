import { useState, useEffect } from 'react';
import { Button, Modal, message, ConfigProvider, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './AddressUser.module.scss';
import AddressCard from '~/components/AddressCard';
import * as userServices from '~/services/userServices';

const cx = classNames.bind(styles);

function AddressUser() {
    const [addresses, setAddresses] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [addressContent, setAddressContent] = useState('');
    const [areaContent, setAreaContent] = useState('');

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
    };

    const handleOk = async () => {
        try {
            // Replace with your actual API call
            await userServices.addUserAddress({ address: addressContent, area: areaContent });
            setIsModalVisible(false);
            success1();

            // Refresh the list of reviews
            const response = await userServices.getUserAddress();
            if (response.status === 200) {
                setAddresses(response.data);
            }
        } catch (error) {
            console.error(error);
            errorMessage1();
        }
    };

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await userServices.getUserAddress();
                if (response.status === 200) {
                    setAddresses(response.data);
                }
            } catch (error) {
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
                console.error('Failed to remove item from cart');
                errorMessage();
            }
        } catch (error) {
            console.error('Failed to remove item from cart', error);
            console.log('Error:', error);
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
                    <Input.TextArea
                        autoSize="true"
                        placeholder="Địa chỉ"
                        onChange={(e) => setAddressContent(e.target.value)}
                        value={addressContent}
                        maxLength={200}
                        showCount
                        style={{ marginBottom: '25px' }}
                    />

                    <Input.TextArea
                        autoSize="true"
                        placeholder="Khu vực"
                        onChange={(e) => setAreaContent(e.target.value)}
                        value={areaContent}
                        maxLength={200}
                        showCount
                        style={{ marginBottom: '25px' }}
                    />
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
