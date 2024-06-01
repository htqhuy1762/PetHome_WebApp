import { useState, useEffect } from 'react';
import { Skeleton, Card, Avatar, Image } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './Post.module.scss';
import * as blogServices from '~/services/blogServices';

const cx = classNames.bind(styles);

function Post({ data }) {
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(data.count || 0);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000); // Simulate loading effect for 2 seconds
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const [likeResponse, likedResponse] = await Promise.all([
                    blogServices.getNumberLikeBlog(data.id_blog),
                    blogServices.isLikedBlog(data.id_blog),
                ]);

                if (likeResponse.status === 200) {
                    setLikes(likeResponse.data.total_like);
                }

                if (likedResponse.status === 200) {
                    setLiked(likedResponse.data.liked);
                }
            } catch (error) {
                // Handle error
                console.error('Failed to fetch blog data', error);
            }
        };

        fetchBlogData();
    }, [data.id_blog]);

    const onLike = () => {
        blogServices
            .toggleLikeBlog(data.id_blog)
            .then((response) => {
                if (response.status === 200) {
                    setLiked((prevLiked) => !prevLiked);
                    setLikes((prevLikes) => (prevLiked ? prevLikes - 1 : prevLikes + 1));
                }
            })
            .catch((error) => {
                // Handle error
                console.error('Failed to toggle like', error);
            });
    };

    return (
        <div className={cx('post')}>
            <Card
                style={{
                    width: '100%',
                    marginTop: 16,
                }}
                actions={[
                    <div style={{ fontSize: '2rem' }} key="like" onClick={onLike} className={cx({ liked: liked })}>
                        {liked ? <HeartFilled key="heart" /> : <HeartOutlined key="heart" />}
                        {likes}
                    </div>,
                ]}
            >
                <Skeleton loading={loading} avatar active>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                        <Avatar
                            size={50}
                            src={data.avatar || 'https://via.placeholder.com/60'}
                            style={{ border: '1px solid rgba(0,0,0,0.5)' }}
                        />
                        <div style={{ marginLeft: '10px' }}>
                            <Card.Meta title={data.username} description={null} />
                        </div>
                    </div>
                </Skeleton>
                {!loading && (
                    <>
                        <p style={{ marginBottom: 16 }}>{data.description}</p>
                        <div className={cx('image-container')}>
                            <Image
                                alt="Post image"
                                src={data.picture || 'https://via.placeholder.com/600x400'}
                                style={{
                                    width: 700,
                                    height: 460,
                                }}
                                preview={true}
                            />
                        </div>
                    </>
                )}
                {loading && (
                    <Skeleton.Image
                        style={{
                            width: 700,
                            height: 460,
                            marginTop: 16,
                        }}
                        active
                    />
                )}
            </Card>
        </div>
    );
}

export default Post;
