import { Row, Col } from 'antd';
import classNames from 'classnames/bind';
import styles from './PetCart.module.scss';
import PetCartElement from '~/components/PetCartElement';

const cx = classNames.bind(styles);

function PetCart() {
    return (
        <div className={cx('wrapper')}>
            <Row className={cx('header')}>
                <Col span={12}><p style={{fontSize: '2rem'}}>Thú cưng</p></Col>
                <Col span={4}><p style={{fontSize: '2rem'}}>Số tiền</p></Col>
                <Col span={4}><p style={{fontSize: '2rem'}}>Tình trạng</p></Col>
                <Col span={4}><p style={{fontSize: '2rem'}}>Thao tác</p></Col>
            </Row>
            <PetCartElement />
        </div>
    );
}

export default PetCart;