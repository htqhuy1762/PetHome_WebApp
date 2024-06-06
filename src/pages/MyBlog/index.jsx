import Post from '~/components/Post';
import classNames from 'classnames/bind';
import styles from './MyBlog.module.scss';
import { Avatar } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { UserOutlined } from '@ant-design/icons';
import backgroundImg from '~/assets/images/BackgroundBlog.png';
import Loading from '~/components/Loading';
import * as blogServices from '~/services/blogServices';
import * as userServices from '~/services/userServices';

const cx = classNames.bind(styles);

function MyBlog() {
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const limit = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            setLoadingUser(true);
            try {
                const response = await userServices.getUser();
                if (response.status === 200) {
                    setUserData(response.data);
                }
            } catch (error) {
                // Handle error
            }
            setLoadingUser(false);
        };

        getUser();
    }, []);

    const fetchBlogs = useCallback(
        async (reset = false) => {
            setLoadingBlogs(true);
            try {
                const response = await blogServices.getUserBlogs({
                    limit: limit,
                    start: reset ? 0 : (currentPage - 1) * limit,
                });
                if (response.status === 200) {
                    const totalCount = response.data.count;
                    const newPosts = response.data.data;
                    if (Array.isArray(newPosts) && newPosts.length > 0) {
                        setPosts((prevPosts) => (reset ? newPosts : [...prevPosts, ...newPosts]));
                        if (totalCount <= currentPage * limit) {
                            setHasMore(false);
                        }
                    } else {
                        setHasMore(false);
                    }
                    if (!reset) {
                        setCurrentPage((prevPage) => prevPage + 1);
                    }
                }
            } catch (error) {
                // Handle error
            }
            setLoadingBlogs(false);
        },
        [currentPage],
    );

    useEffect(() => {
        fetchBlogs(true);
    }, [fetchBlogs]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
                loadingBlogs ||
                !hasMore
            ) {
                return;
            }
            fetchBlogs();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchBlogs, loadingBlogs, hasMore]);

    const updateUI = () => {
        setCurrentPage(1); 
        setHasMore(true); 
        fetchBlogs(true); 
    };

    const deletePostUI = (deletedPostId) => {
        setPosts((prevPosts) => prevPosts.filter(post => post.id_blog !== deletedPostId));
        setCurrentPage(1);
        setHasMore(true); 
        fetchBlogs(true); 
    };

    if (loadingUser || (loadingBlogs && currentPage === 1)) {
        return <Loading />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')} style={{ backgroundImage: `url(${backgroundImg})` }}>
                <div className={cx('profile-info')}>
                    <Avatar
                        style={{ marginTop: '80px' }}
                        size={170}
                        icon={!userData?.avatar ? <UserOutlined /> : null}
                        src={userData?.avatar || null}
                    />
                    <h2 style={{ marginTop: '15px' }}>{userData?.name}</h2>
                </div>
            </div>
            <div className={cx('content')}>
                {posts?.map((post) => (
                    <Post
                        key={post.id_blog}
                        data={post}
                        showMenu={true}
                        updateUI={updateUI}
                        deletePostUI={deletePostUI}
                    />
                ))}
                {!hasMore && <div className={cx('end-message')}>Bạn đã xem hết các bài post</div>}
            </div>
        </div>
    );
}

export default MyBlog;
