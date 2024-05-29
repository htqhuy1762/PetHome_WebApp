import classNames from 'classnames/bind';
import styles from './Blog.module.scss';

const cx = classNames.bind(styles);

function Blogs() {
    return <div className={cx('wrapper')}></div>;
}

export default Blogs;
