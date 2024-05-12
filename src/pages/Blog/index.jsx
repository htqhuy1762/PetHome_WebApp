import Post from '../../components/Post';
import classNames from 'classnames/bind';
import styles from './Blog.module.scss';
import { Tabs } from 'antd';

const cx = classNames.bind(styles);

function Blog() {
    const items = [
        {
            key: '1',
            label: 'Mạng xã hội',
            children: <Post />,
        },
        {
            key: '2',
            label: 'Trang cá nhân',
            children: 'Content of Tab Pane 2',
        }
    ];
    return (
        <div className={cx('wrapper')}>
            <Tabs defaultActiveKey="1" items={items} />
        </div>
    );
}

export default Blog;
