import classNames from "classnames/bind";
import styles from "./Post.module.scss";
import { Avatar, Typography, Image, Button } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

const { Title, Text } = Typography;
const cx = classNames.bind(styles);

function Post({post}) {
    const { username, content, imageUrl, likes, userLiked } = post; // replace with your actual data structure

    return (
        <div className={cx('post')}>
            <div className={cx('header')}>
                <Avatar src={post.userAvatar} />
                <Title level={4}>{username}</Title>
            </div>
            <Text>{content}</Text>
            <Image src={imageUrl} />
            <div className={cx('footer')}>
                <Button 
                    type="text" 
                    icon={userLiked ? <HeartFilled /> : <HeartOutlined />} 
                    onClick={() => {/* handle like button click */}}
                >
                    {likes}
                </Button>
            </div>
        </div>
    );
}

export default Post;