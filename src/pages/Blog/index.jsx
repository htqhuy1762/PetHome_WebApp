import classNames from 'classnames/bind';
import styles from './Blog.module.scss';
import { Tabs } from 'antd';

const cx = classNames.bind(styles);

function Blog() {
    const items = [
        {
            key: '1',
            label: 'Mạng xã hội',
            children: 'Content of Tab Pane 1',
        },
        {
            key: '2',
            label: 'Trang cá nhân',
            children: 'Content of Tab Pane 2',
        }
    ];
    return (
        <Tabs defaultActiveKey="1" items={items} />
    );
}

export default Blog;
