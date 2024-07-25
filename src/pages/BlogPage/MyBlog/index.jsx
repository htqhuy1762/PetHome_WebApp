import Post from '~/components/Post';
import classNames from 'classnames/bind';
import styles from './MyBlog.module.scss';
import { Avatar, Button, Spin, Empty, ConfigProvider, Modal, message, Form, Input, Select, Upload } from 'antd';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import { UserOutlined } from '@ant-design/icons';
import backgroundImg from '~/assets/images/BackgroundBlog.png';
import { useNavigate } from 'react-router-dom';
import Loading from '~/components/Loading';
import * as blogServices from '~/services/blogServices';
import * as userServices from '~/services/userServices';

const cx = classNames.bind(styles);

function MyBlog() {
    const [form] = Form.useForm();
    const [userData, setUserData] = useState(null);
    const [images, setImages] = useState([]);
    const [posts, setPosts] = useState([]);
    const allPostsLoaded = useRef(false);
    const [start, setStart] = useState(0);
    const navigate = useNavigate();
    const limit = 5;
    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingBlogs, setLoadingBlogs] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [addPostVisible, setAddPostVisible] = useState(false);
    const [adding, setAdding] = useState(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    useEffect(() => {
        form.setFieldsValue({ text: '', privillage: 'public' });
    }, [form]);

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

    const fetchBlogs = async (start) => {
        setLoadingBlogs(true);
        try {
            const response = await blogServices.getUserBlogs({
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

    const handleValuesChange = (changedValues, allValues) => {
        const { text } = allValues;
        const hasText = text && text.trim().length > 0;
        const hasImages = images.length > 0;
        setIsSubmitDisabled(!hasText && !hasImages);
    };

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

    const updateUI = () => {
        setHasMore(true);
        fetchBlogs(true);
    };

    const deletePostUI = (deletedPostId) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id_blog !== deletedPostId));
        setHasMore(true);
        fetchBlogs(true);
    };

    const handleCancelAdd = () => {
        setAddPostVisible(false);
    };

    const handleOpenAddPost = () => {
        setAddPostVisible(true);
    };

    const handleAddPost = async () => {
        setAdding(true);
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
        setAdding(false);
        setAddPostVisible(false);
    };

    if (loadingUser) {
        return <Loading />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')} style={{ backgroundImage: `url(${backgroundImg})` }}>
                <div className={cx('profile-info')}>
                    <Avatar
                        size={170}
                        icon={!userData?.avatar ? <UserOutlined /> : null}
                        src={userData?.avatar || null}
                    />
                    <h2 style={{ marginLeft: '15px', fontSize: '3.2rem' }}>{userData?.name}</h2>
                </div>
                <div className={cx('list-button')}>
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
                        <Button
                            className={cx('myblog-btn')}
                            icon={<PlusOutlined />}
                            onClick={() => handleOpenAddPost()}
                        >
                            Thêm bài viết
                        </Button>
                        <Button className={cx('myblog-btn')} icon={<HomeOutlined />} onClick={() => navigate('/blogs')}>
                            Quay về trang chủ
                        </Button>
                    </ConfigProvider>
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
                {loadingBlogs && <Spin className={cx('spin')} />}
                {!loadingBlogs && !hasMore && posts.length >= 0 && (
                    <div className={cx('end-message')}>Bạn đã xem hết các bài viết</div>
                )}
            </div>
            <Modal
                title="Thêm bài viết"
                open={addPostVisible}
                onCancel={handleCancelAdd}
                footer={[
                    <Button key="cancel" onClick={handleCancelAdd}>
                        Hủy
                    </Button>,
                    <Button
                        htmlType="submit"
                        key="delete"
                        type="primary"
                        onClick={handleAddPost}
                        loading={adding}
                        disabled={isSubmitDisabled}
                    >
                        Đăng
                    </Button>,
                ]}
            >
                <Form
                    className={cx('form-container')}
                    onFinish={handleAddPost}
                    form={form}
                    initialValues={{ privillage: 'public' }}
                    onValuesChange={handleValuesChange}
                >
                    <div className={cx('form-header')}>
                        <Form.Item style={{ width: '100%' }} name="text">
                            <Input.TextArea placeholder="Bạn đang nghĩ gì thế?" autoSize={{ minRows: 3, maxRows: 6 }} />
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
            </Modal>
        </div>
    );
}

export default MyBlog;
