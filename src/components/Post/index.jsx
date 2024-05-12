import { useState } from 'react';
import { Skeleton, Switch, Card, Avatar, Image } from 'antd'; // Add Image here
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import logo from '~/assets/images/logo.png'; // replace with your logo path
import classNames from 'classnames/bind';
import styles from './Post.module.scss';

const cx = classNames.bind(styles);

function Post() {
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);

    const onChange = (checked) => {
        setLoading(!checked);
    };

    const onLike = () => {
        setLikes(liked ? likes - 1 : likes + 1);
        setLiked(!liked);
    };

    return (
        <div className={cx('post')}>
            <Switch style={{ width: 50 }} checked={!loading} onChange={onChange} />
            <Card
                style={{
                    width: 650,
                    marginTop: 16,
                }}
                actions={[
                    <div key="like" onClick={onLike}>
                        {liked ? <HeartFilled key="heart" /> : <HeartOutlined key="heart" />}
                        {likes}
                    </div>
                ]}
            >
                <Skeleton loading={loading} avatar active>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar size={60} src={logo} style={{ border: '1px solid rgba(0,0,0,0.5)' }} />
                        <Card.Meta title="Card title" style={{ marginLeft: '10px' }} />
                    </div>
                    <p>Alo alo</p>
                </Skeleton>
                {loading ? (
                    <Skeleton.Image
                        style={{
                            width: 600,
                            height: 400,
                            marginTop: 16,
                        }}
                        active
                    /> 
                ) : (
                    <Image alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
                )}
            </Card>
        </div>
    );
}

export default Post;