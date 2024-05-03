import classNames from 'classnames/bind';
import styles from './Rating.module.scss';
import { Rate } from 'antd';

const cx = classNames.bind(styles);

function Rating({ data }) {
    const date = new Date(data.created_at);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('username')}>{data.user_name}</div>
            <div className={cx('date')}>{date.toLocaleDateString()}</div>
            <div className={cx('star-rating')}>
                <Rate disabled defaultValue={data.rate} />
            </div>
            <div className={cx('comment')}>
                <p>{data.comment}</p>
            </div>
        </div>
    );
}

export default Rating;
