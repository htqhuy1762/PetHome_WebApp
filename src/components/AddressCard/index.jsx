import { Button } from 'antd';
import classNames from 'classnames/bind';
import styles from './AddressCard.module.scss';
import PropTypes from 'prop-types';

const cx = classNames.bind(styles);

function AddressCard({ address, onRemove }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('info-container')}>
                <div className={cx('address')}>
                    <p style={{ fontWeight: 700, marginRight: '5px' }}>Địa chỉ:</p>
                    {address.address}
                </div>
                <div className={cx('area')}>
                    <p style={{ fontWeight: 700, marginRight: '5px' }}>Khu vực:</p>
                    {address.area}
                </div>
            </div>
            <Button className={cx('remove-btn')} danger type="link" onClick={() => onRemove(address.id_address)}>
                Xóa
            </Button>
        </div>
    );
}

AddressCard.propTypes = {
    address: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default AddressCard;
