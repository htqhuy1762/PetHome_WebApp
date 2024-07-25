import Post from '~/components/Post';
import { Form, Input, Spin, Button, Upload, Avatar, message, ConfigProvider, Select, Empty } from 'antd';
import { UserOutlined, PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './Blog.module.scss';
import { useState, useEffect, useRef } from 'react';
import * as blogServices from '~/services/blogServices';
import * as userServices from '~/services/userServices';
import { useNavigate } from 'react-router-dom';
import Loading from '~/components/Loading';

const cx = classNames.bind(styles);

function Blog() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const allPostsLoaded = useRef(false);
    const limit = 2;
    const [start, setStart] = useState(0);
    const [userData, setUserData] = useState(null);
    const [form] = Form.useForm();
    const [images, setImages] = useState([]);
    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingBlogs, setLoadingBlogs] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    useEffect(() => {
        form.setFieldsValue({ text: '', privillage: 'public' });
    }, [form]);

    const handleValuesChange = (changedValues, allValues) => {
        const { text } = allValues;
        const hasText = text && text.trim().length > 0;
        const hasImages = images.length > 0;
        setIsSubmitDisabled(!hasText && !hasImages);
    };

    const beforeUploadImages = (file) => {
        if (images.length >= 10) {
            message.error('Chỉ được phép tải lên tối đa 10 hình!');
            return false;
        }

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
        setImages([...images, file]);
        return false;
    };

    const handleRemoveImage = (file) => {
        setImages(images.filter((image) => image.uid !== file.uid));
    };

    const uploadButtonImages = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Thêm ảnh
            </div>
        </button>
    );

    const fetchBlogs = async (start) => {
        setLoadingBlogs(true);
        try {
            const response = await blogServices.getBlogs({
                start,
                limit,
            });
            if (response.status === 200) {
                const newPosts = response.data.data || [];
                if (newPosts.length > 0) {
                    if (start === 0) {
                        setPosts(newPosts);
                    } else {
                        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
                    }
                    setHasMore(newPosts.length === limit);
                } else {
                    setHasMore(false);
                    allPostsLoaded.current = true;
                }
            }
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
        } finally {
            setLoadingBlogs(false);
        }
    };

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
        fetchBlogs(start);
    }, [start]);

    const handleScroll = () => {
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        const scrollHeight =
            (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;
        const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

        console.log(hasMore, loadingBlogs, !allPostsLoaded.current);
        if (scrolledToBottom && hasMore && !loadingBlogs && !allPostsLoaded.current) {
            setStart((prevStart) => prevStart + limit);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handlePostSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();
            formData.append('description', values.text);
            formData.append('status', values.privillage);
            images.forEach((image) => {
                formData.append('images', image);
            });

            const response = await blogServices.addBlog(formData);
            if (response.status === 200) {
                message.success('Đăng bài thành công!');
                fetchBlogs(true);
                form.resetFields();
                setImages([]);
                setHasMore(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            message.error('Đăng bài thất bại. Làm ơn thử lại!.');
        }
    };

    if (loadingUser) {
        return <Loading />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('sidebar')}>
                <Avatar style={{ marginTop: '40px' }} size={80} icon={<UserOutlined />} src={userData?.avatar}></Avatar>
                <h3 style={{ marginTop: '15px' }}>{userData?.name}</h3>
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
                    <Button style={{ marginTop: '20px' }} onClick={() => navigate('/blogs/myblog')}>
                        Xem trang cá nhân
                    </Button>
                </ConfigProvider>
            </div>
            <div className={cx('content')}>
                <div className={cx('form-post')}>
                    <Form
                        onFinish={handlePostSubmit}
                        form={form}
                        initialValues={{ privillage: 'public' }}
                        onValuesChange={handleValuesChange}
                    >
                        <div className={cx('form-header')}>
                            <Avatar
                                style={{ marginRight: '10px' }}
                                size={50}
                                icon={<UserOutlined />}
                                src={userData?.avatar}
                            />
                            <Form.Item style={{ width: '90%' }} name="text">
                                <Input.TextArea
                                    placeholder="Bạn đang nghĩ gì thế?"
                                    autoSize={{ minRows: 3, maxRows: 6 }}
                                />
                            </Form.Item>
                        </div>
                        <div className={cx('form-footer')}>
                            <Form.Item name="privillage">
                                <Select
                                    style={{
                                        width: 120,
                                    }}
                                    options={[
                                        {
                                            value: 'public',
                                            label: 'Công khai',
                                        },
                                        {
                                            value: 'private',
                                            label: 'Riêng tư',
                                        },
                                    ]}
                                />
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
                                    <Button htmlType="submit" key="delete" disabled={isSubmitDisabled}>
                                        Đăng
                                    </Button>
                                </ConfigProvider>
                            </Form.Item>
                        </div>
                        <Form.Item name="image">
                            <Upload
                                listType="picture-card"
                                beforeUpload={beforeUploadImages}
                                fileList={images.map((file) => ({
                                    uid: file.uid,
                                    name: file.name,
                                    status: 'done',
                                    url: URL.createObjectURL(file),
                                }))}
                                onRemove={handleRemoveImage}
                                showUploadList={{ showRemoveIcon: true }}
                            >
                                {images.length < 10 && uploadButtonImages}
                            </Upload>
                        </Form.Item>
                    </Form>
                </div>
                <div className={cx('list-post')}>
                    {posts?.map((post) => (
                        <Post key={post.id_blog} data={post} />
                    ))}
                    {loadingBlogs && <Spin className={cx('spin')} />}
                    {!loadingBlogs && !hasMore && posts.length >= 0 && (
                        <div className={cx('end-message')}>Bạn đã xem hết các bài viết</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Blog;
