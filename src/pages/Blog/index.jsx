import Post from '~/components/Post';
import { Form, Input, Button, Upload, Avatar, message } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './Blog.module.scss';
import { useState, useEffect, useCallback } from 'react';
import * as blogServices from '~/services/blogServices';
import * as userServices from '~/services/userServices';
import Loading from '~/components/Loading';

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
    const [hasMore, setHasMore] = useState(true); // Thêm trạng thái hasMore

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
        return false; // Ngăn không upload ngay lập tức
    };

    const fetchBlogs = useCallback(async () => {
        setLoadingBlogs(true);
        try {
            const response = await blogServices.getBlogs({ limit: limit, start: (currentPage - 1) * limit });
            console.log(response);
            if (response.status === 200) {
                const totalCount = response.data.count;
                const newPosts = response.data.data;
                if (Array.isArray(newPosts) && newPosts.length > 0) {
                    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
                    setCurrentPage((prevPage) => prevPage + 1);
                    if (totalCount <= currentPage * limit) {
                        setHasMore(false); // Không còn bài blog nào để tải thêm
                    }
                } else {
                    setHasMore(false); // Không còn bài blog nào để tải thêm
                }
            }
        } catch (error) {
            // Handle error
        }
        setLoadingBlogs(false);
    }, [currentPage]);

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
        fetchBlogs();
    }, [fetchBlogs]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
                loadingBlogs ||
                !hasMore // Thêm điều kiện hasMore
            ) {
                return;
            }
            fetchBlogs();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchBlogs, loadingBlogs, hasMore]); // Thêm hasMore vào dependencies

    const handlePostSubmit = async () => {
        try {
            // Xác thực và lấy giá trị từ các trường trong form
            const values = await form.validateFields();
            
            // Tạo formData
            const formData = new FormData();
            formData.append('description', values.text); // Thêm giá trị từ TextArea vào formData
            if (fileList.length > 0) {
                formData.append('picture', fileList[0]); // Thêm file hình ảnh vào formData
            }
    
            // Gửi formData lên server
            const response = await blogServices.sendFormData(formData);
            
            // Xử lý phản hồi từ server ở đây (nếu cần)
            if (response.status === 200) {
                // Cập nhật lại danh sách bài post
                setPosts((prevPosts) => [response.data, ...prevPosts]);
                
                // Tăng currentPage lên 1 nếu đã đến cuối trang
                if (posts.length % limit === 0) {
                    setCurrentPage((prevPage) => prevPage + 1);
                }

                // Đặt lại trạng thái hasMore
                setHasMore(true);

                // Cuộn lên đầu trang
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            
            // Reset form và fileList sau khi gửi thành công
            form.resetFields();
            setFileList([]);
            setImageUrl(null);
    
            // Hiển thị thông báo thành công
            message.success('Post submitted successfully!');
        } catch (error) {
            // Xử lý lỗi nếu có
            message.error('Failed to submit post. Please try again later.');
        }
    };

    if (loadingUser || (loadingBlogs && currentPage === 1)) {
        // Chỉ hiển thị Loading nếu là lần tải đầu tiên
        return <Loading />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('sidebar')}>
                <Avatar style={{ marginTop: '40px' }} size={80} src={userData?.avatar}></Avatar>
                <h3 style={{ marginTop: '15px' }}>{userData?.name}</h3>
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
                                <Input.TextArea placeholder="Start a post" autoSize={{ minRows: 2, maxRows: 6 }} />
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
                                    <Button icon={<UploadOutlined />}>Add Photo</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Post
                                </Button>
                            </Form.Item>
                        </div>
                    </Form>
                </div>
                <div className={cx('list-post')}>
                    {posts?.map((post) => (
                        <Post key={post.id_blog} data={post} />
                    ))}
                    {!hasMore && <div className={cx('end-message')}>Bạn đã xem hết các bài post</div>}{' '}
                    {/* Hiển thị thông báo */}
                </div>
            </div>
        </div>
    );
}

export default Blog;
