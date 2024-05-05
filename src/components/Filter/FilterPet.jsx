import classNames from 'classnames/bind';
import styles from './Filter.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Checkbox, Radio, Slider } from 'antd';

const cx = classNames.bind(styles);

function FilterPet() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <FontAwesomeIcon style={{ fontSize: '2rem' }} icon={faFilter} />
                <span style={{ marginLeft: '4px' }}>BỘ LỌC TÌM KIẾM</span>
            </div>
            <div className={cx('content')}>
                <div>
                    <h3>Loại thú cưng</h3>
                    <Checkbox.Group>
                        <Checkbox value="dog">Chó</Checkbox>
                        <Checkbox value="cat">Mèo</Checkbox>
                    </Checkbox.Group>

                    <h3>Giới tính</h3>
                    <Radio.Group>
                        <Radio value="male">Đực</Radio>
                        <Radio value="female">Cái</Radio>
                    </Radio.Group>

                    <h3>Giá</h3>
                    <Slider range defaultValue={[20, 50]} />
                </div>
            </div>
        </div>
    );
}

export default FilterPet;
