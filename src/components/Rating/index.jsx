import classNames from 'classnames/bind';
import styles from './Rating.module.scss';
import { Rate, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function Rating({ data }) {
    const date = new Date(data.created_at);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('element1')}>
                <Avatar
                    src={data?.avatar ? data.avatar : null}
                    icon={!data?.avatar ? <UserOutlined /> : null}
                    size={50}
                    style={{ border: '1px solid rgb(0, 0, 0, 0.25)', marginRight: '15px' }}
                />
            </div>
            <div className={cx('element2')}>
                <div className={cx('username')}>{data.username}</div>

                <div className={cx('star-rating')}>
                    <Rate disabled defaultValue={data.rate} />
                </div>
                <div className={cx('date')}>{date.toLocaleDateString('vi-VN')}</div>
                <div className={cx('comment')}>
                    <p>{data.comment}</p>
                </div>
            </div>
        </div>
    );
}

export default Rating;
