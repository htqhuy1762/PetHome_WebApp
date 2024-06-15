import Post from '~/components/Post';
import { Form, Input, Button, Upload, Avatar, message, ConfigProvider } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './Blog.module.scss';
import { useState, useEffect, useCallback } from 'react';
import * as blogServices from '~/services/blogServices';
import * as userServices from '~/services/userServices';
import Loading from '~/components/Loading';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Blog() {
    const [posts, setPosts] = useState([]);
    const limit = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [userData, setUserData] = useState(null);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
            return false;
        }
        getBase64(file, (url) => {
            setImageUrl(url);
            setFileList([file]);
        });
        return false;
    };

    const fetchBlogs = useCallback(
        async (reset = false) => {
            setLoadingBlogs(true);
            try {
                const response = await blogServices.getBlogs({
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

    const handlePostSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append('description', values.text);
            if (fileList.length > 0) {
                formData.append('picture', fileList[0]);
            }

            const response = await blogServices.addBlog(formData);
            if (response.status === 200) {
                message.success('Post submitted successfully!');
                fetchBlogs(true);
                form.resetFields();
                setFileList([]);
                setImageUrl(null);
                setCurrentPage(1);
                setHasMore(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            message.error('Failed to submit post. Please try again later.');
        }
    };

    if (loadingUser || (loadingBlogs && currentPage === 1)) {
        return <Loading />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('sidebar')}>
                <Link
                    to={`/blogs/myblog`}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: 'inherit',
                    }}
                >
                    <Avatar
                        style={{ marginTop: '40px' }}
                        size={80}
                        icon={<UserOutlined />}
                        src={userData?.avatar}
                    ></Avatar>
                    <h3 style={{ marginTop: '15px' }}>{userData?.name}</h3>
                </Link>
            </div>
            <div className={cx('content')}>
                <div className={cx('form-post')}>
                    <Form onFinish={handlePostSubmit} form={form}>
                        <div className={cx('form-header')}>
                            <Avatar
                                style={{ marginRight: '10px' }}
                                size={50}
                                icon={<UserOutlined />}
                                src={userData?.avatar}
                            />
                            <Form.Item style={{ width: '90%' }} name="text">
                                <Input.TextArea placeholder="Start a post" autoSize={{ minRows: 3, maxRows: 6 }} />
                            </Form.Item>
                        </div>
                        <div className={cx('form-footer')}>
                            <Form.Item name="image">
                                <Upload
                                    beforeUpload={beforeUpload}
                                    fileList={fileList}
                                    onRemove={() => {
                                        setFileList([]);
                                        setImageUrl(null);
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>Thêm ảnh</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <ConfigProvider
                                    theme={{
                                        components: {
                                            Button: {
                                                defaultColor: 'white',
                                                defaultBg: 'var(--button-next-color)',
                                                defaultBorderColor: 'var(--button-next-color)',
                                                defaultHoverBorderColor: 'var(--button-next-color)',
                                                defaultHoverBg: 'var(--button-next-color)',
                                                defaultHoverColor: 'white',
                                            },
                                        },
                                    }}
                                >
                                    <Button htmlType="submit" style={{ width: '70px', height: '35px' }}>
                                        Đăng
                                    </Button>
                                </ConfigProvider>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
                <div className={cx('list-post')}>
                    {posts?.map((post) => (
                        <Post key={post.id_blog} data={post} />
                    ))}
                    {!hasMore && <div className={cx('end-message')}>Bạn đã xem hết các bài post</div>}
                </div>
            </div>
        </div>
    );
}

export default Blog;