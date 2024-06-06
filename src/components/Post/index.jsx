import { useState, useEffect } from 'react';
import { Skeleton, Card, Avatar, Image, Dropdown, Modal, Button, Input } from 'antd';
import { HeartOutlined, HeartFilled, EllipsisOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './Post.module.scss';
import * as blogServices from '~/services/blogServices';
import { UserOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function Post({ data, showMenu, updateUI, deletePostUI }) {
    const [updating, setUpdating] = useState(false);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(data.count || 0);
    const [liked, setLiked] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [editContent, setEditContent] = useState(data.description || ''); // State lưu nội dung bài viết đang chỉnh sửa
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [deleting, setDeleting] = useState(false);

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

    const handleSaveChanges = async () => {
        try {
            setUpdating(true);
            const formData = new FormData();
            formData.append('description', editContent);

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
                            icon={!data.avatar ? <UserOutlined /> : null}
                            src={data.avatar || null}
                            style={{ border: '1px solid rgba(0,0,0,0.5)' }}
                        />
                        <div style={{ marginLeft: '10px' }}>
                            <Card.Meta title={data.username} description={null} />
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
                <Input.TextArea
                    value={editContent}
                    onChange={handleEditContentChange}
                    placeholder="Start a post"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                />
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
