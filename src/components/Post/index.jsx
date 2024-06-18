import { useState, useEffect } from 'react';
import { Skeleton, Card, Avatar, Image, Dropdown, Modal, Button, Input, Row, Col, Carousel, Form, Select } from 'antd';
import { HeartOutlined, HeartFilled, EllipsisOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './Post.module.scss';
import * as blogServices from '~/services/blogServices';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const cx = classNames.bind(styles);

function Post({ data, showMenu, updateUI, deletePostUI }) {
    const [form] = Form.useForm();
    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(data.count || 0);
    const [liked, setLiked] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [editContent, setEditContent] = useState(data.description || ''); // State lưu nội dung bài viết đang chỉnh sửa
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [deleting, setDeleting] = useState(false);
    let imageContent = null;

    const formattedDate = dayjs.utc(data.created_at).utcOffset(7).format('DD/MM/YYYY HH:mm');

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000); // Giả lập hiệu ứng tải trong 2 giây
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
                // Xử lý lỗi
                console.error('Failed to fetch blog data', error);
            }
        };

        fetchBlogData();
    }, [data.id_blog]);

    const onLike = async () => {
        try {
            const response = await blogServices.toggleLikeBlog(data.id_blog);
            if (response.status === 200) {
                setLiked((prevLiked) => {
                    const newLiked = !prevLiked;
                    setLikes((prevLikes) => (newLiked ? prevLikes + 1 : prevLikes - 1));
                    return newLiked;
                });
            }
        } catch (error) {
            // Xử lý lỗi
            console.error('Failed to toggle like', error);
        }
    };

    const handleEditPost = () => {
        setIsModalVisible(true); // Hiển thị modal chỉnh sửa bài viết
        setEditContent(data.description || ''); // Load nội dung bài viết vào ô text
    };

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                text: data?.description,
                privillage: data?.status,
            });
        }
    }, [data, form]);

    const handleSaveChanges = async () => {
        try {
            setUpdating(true);
            await form.validateFields();
            const values = form.getFieldsValue();

            const formData = new FormData();
            formData.append('description', values.text);
            formData.append('status', values.privillage);

            const response = await blogServices.updateBlog(data.id_blog, formData);
            if (response.status === 200) {
                setIsModalVisible(false);
                setUnsavedChanges(false);
                // Cập nhật lại UI nếu cần thiết
                updateUI();
            }
        } catch (error) {
            // Xử lý lỗi
            console.error('Failed to update post', error);
        } finally {
            setUpdating(false); // Đặt trạng thái updating thành false
        }
    };

    const handleCancelEdit = () => {
        // Xử lý hủy chỉnh sửa
        if (unsavedChanges) {
            setIsModalVisible(false);
            showUnsavedChangesModal();
        } else {
            setIsModalVisible(false);
        }
    };

    const handleDeletePost = async () => {
        try {
            setDeleting(true); // Đặt trạng thái deleting thành true
            const response = await blogServices.deleteBlog(data.id_blog);
            if (response.status === 200) {
                console.log('Deleted post successfully');
                deletePostUI(data.id_blog);
            }
        } catch (error) {
            // Xử lý lỗi
            console.error('Failed to delete post', error);
        } finally {
            setDeleting(false); // Đặt trạng thái deleting thành false
        }
    };

    const handleModalDeletePost = () => {
        setIsDeleteModalVisible(true); // Hiển thị modal hỏi xóa bài viết
    };

    const showUnsavedChangesModal = () => {
        Modal.confirm({
            title: 'Thay đổi chưa được lưu',
            content: 'Bạn có muốn lưu thay đổi không?',
            okText: 'Lưu',
            cancelText: 'Bỏ',
            onOk: handleSaveChanges,
            onCancel: setIsModalVisible.bind(null, false),
        });
    };

    const handleEditContentChange = (e) => {
        setEditContent(e.target.value);
        setUnsavedChanges(true); // Đánh dấu là đã có thay đổi chưa được lưu
    };

    const items = [
        {
            key: '1',
            label: 'Sửa bài viết',
            onClick: handleEditPost,
        },
        {
            key: '2',
            label: 'Xóa bài viết',
            onClick: handleModalDeletePost,
        },
    ];

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false); // Ẩn modal xóa bài viết
    };

    if (data.images && data.images.length > 0) {
        if (data.images.length === 1) {
            imageContent = (
                <div className={cx('image-container')}>
                    <Image
                        alt="Post image"
                        src={data.images[0]}
                        style={{
                            width: 700,
                            height: 460,
                        }}
                        preview={true}
                    />
                </div>
            );
        } else if (data.images.length === 2) {
            const cols = data.images.map((pic, index) => (
                <Col key={index.toString()} span={12}>
                    <div className={cx('image-container')}>
                        <Image
                            alt={`Post image ${index + 1}`}
                            src={pic}
                            style={{
                                width: '100%',
                                height: 460,
                            }}
                            preview={true}
                        />
                    </div>
                </Col>
            ));

            imageContent = <Row gutter={[16, 16]}>{cols}</Row>;
        } else if (data.images.length === 3) {
            const firstImage = data.images[0];
            const restImages = data.images.slice(1);

            const secondAndThirdImages = restImages.map((pic, index) => (
                <div key={index.toString()} className={cx('image-container')}>
                    <Image
                        alt={`Post image ${index + 2}`}
                        src={pic}
                        style={{
                            width: '100%',
                            height: 230,
                        }}
                        preview={true}
                    />
                </div>
            ));

            imageContent = (
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <div className={cx('image-container')}>
                            <Image
                                alt="Post image 1"
                                src={firstImage}
                                style={{
                                    width: '100%',
                                    height: 460,
                                }}
                                preview={true}
                            />
                        </div>
                    </Col>
                    <Col span={12}>{secondAndThirdImages}</Col>
                </Row>
            );
        } else {
            imageContent = (
                <Carousel
                    autoplay={true}
                    autoplaySpeed={5000}
                    arrows
                    infinite={true}
                    style={{ width: 700, height: 460 }}
                >
                    {data.images.map((image, index) => (
                        <div key={index.toString()} className={cx('image-container')}>
                            <Image
                                fallback="data:image/png;base64,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"
                                style={{
                                    width: 700,
                                    height: 460,
                                }}
                                src={image}
                                alt={`Post image ${index + 1}`}
                                preview={true}
                            />
                        </div>
                    ))}
                </Carousel>
            );
        }
    }

    return (
        <div className={cx('post')}>
            <Card
                style={{
                    width: '100%',
                    marginTop: 16,
                }}
                actions={[
                    <div
                        style={{ fontSize: '2.4rem', display: 'flex', marginLeft: '35px', alignItems: 'center' }}
                        key="like"
                        onClick={onLike}
                        className={cx({ liked: liked })}
                    >
                        {liked ? <HeartFilled key="heart" /> : <HeartOutlined key="heart" />}
                        <span style={{ marginLeft: '3px', lineHeight: 1 }}>{likes}</span>
                    </div>,
                ]}
            >
                <Skeleton loading={loading} avatar active>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                        <Avatar
                            size={50}
                            icon={!data.avatar ? <UserOutlined /> : null}
                            src={data.avatar || null}
                            style={{ border: '1px solid rgba(0,0,0,0.5)' }}
                        />
                        <div style={{ marginLeft: '10px' }}>
                            <Card.Meta title={data.username} description={null} />
                            <div style={{ display: 'flex' }}>
                                <Card.Meta style={{ marginTop: '5px' }} title={null} description={formattedDate} />
                                <Card.Meta
                                    style={{ marginTop: '5px', marginLeft: '8px' }}
                                    title={null}
                                    description={data.status === 'public' ? 'Công khai' : 'Riêng tư'}
                                />
                            </div>
                        </div>
                        {showMenu && (
                            <div style={{ marginLeft: 'auto' }}>
                                <Dropdown menu={{ items }}>
                                    <EllipsisOutlined style={{ fontSize: '1.5rem' }} />
                                </Dropdown>
                            </div>
                        )}
                    </div>
                </Skeleton>
                {!loading && (
                    <>
                        <p style={{ marginBottom: 16 }}>{data.description}</p>
                        <div className={cx('image-container')}>{imageContent}</div>
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
            <Modal
                title="Chỉnh sửa bài viết"
                open={isModalVisible}
                onCancel={handleCancelEdit}
                footer={[
                    <Button key="cancel" onClick={handleCancelEdit}>
                        Hủy
                    </Button>,
                    <Button key="save" type="primary" onClick={handleSaveChanges} loading={updating}>
                        Lưu
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    initialValues={{
                        text: data?.description,
                        privillage: data?.status,
                    }}
                >
                    <Form.Item name="text">
                        <Input
                            value={editContent}
                            onChange={handleEditContentChange}
                            placeholder="Start a post"
                            style={{ fontSize: '1.6rem' }}
                        />
                    </Form.Item>
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
                </Form>
            </Modal>
            <Modal
                title="Xóa bài viết"
                open={isDeleteModalVisible} // Sử dụng biến state mới này
                onCancel={handleCancelDelete}
                footer={[
                    <Button key="cancel" onClick={handleCancelDelete}>
                        Hủy
                    </Button>,
                    <Button key="delete" type="primary" onClick={handleDeletePost} loading={deleting}>
                        Xóa
                    </Button>,
                ]}
            >
                Bạn có chắc chắn muốn xóa bài viết này không?
            </Modal>
        </div>
    );
}

export default Post;
