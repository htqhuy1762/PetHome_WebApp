import { useState, useEffect, useContext, useRef } from 'react';
import classNames from 'classnames/bind';
import styless from './ChatBox.module.scss';
import { AuthContext } from '~/components/AuthProvider/index.jsx';
import {
    MainContainer,
    Sidebar,
    ConversationList,
    Conversation,
    ConversationHeader,
    MessageList,
    MessageInput,
    Message,
    ChatContainer,
    Avatar,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Button, Card } from 'antd';
import { WechatOutlined, CloseSquareOutlined } from '@ant-design/icons';
import * as chatServices from '~/services/chatServices';

const cx = classNames.bind(styless);

function ChatBox() {
    const { isLoggedIn } = useContext(AuthContext);
    const [isChatBoxVisible, setChatBoxVisible] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);
    const [idUser, setIdUser] = useState(null);

    // load conservation list
    const fetchRooms = async () => {
        try {
            const response = await chatServices.getUserRooms();
            if (response.status === 200) {
                setRooms(response.data);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    useEffect(() => {
        const fetchRoomUser = async () => {
            if (currentRoom) {
                const response = await chatServices.createRoomUser({ id_shop: currentRoom.id_shop });

                if (response.status === 200) {
                    const { id_room, id_user } = response.data;
                    setIdUser(id_user);
                    const wsURL = `wss://chat-service-uukxkowwha-as.a.run.app/ws/joinRoom/${id_room}?id_user=${id_user}`;
                    // Khởi tạo kết nối WebSocket khi chọn phòng
                    socketRef.current = new WebSocket(wsURL);

                    socketRef.current.onopen = () => {
                        console.log('WebSocket is connected');
                    };

                    socketRef.current.onmessage = (event) => {
                        const message = JSON.parse(event.data);
                        setMessages((prevMessages) => [...prevMessages, message]);
                    };

                    socketRef.current.onclose = () => {
                        console.log('WebSocket is closed');
                    };

                    socketRef.current.onerror = (error) => {
                        console.error('WebSocket error:', error);
                    };
                }
            }
        };

        fetchRoomUser();

        return () => {
            // Dọn dẹp kết nối WebSocket khi component unmount hoặc phòng thay đổi
            if (socketRef.current) {
                console.log('Component unmounted or room changed, closing WebSocket');
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [currentRoom]);

    const sendMessage = (messageContent) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(messageContent);
        }
    };

    const toggleChatBox = () => {
        const newVisibility = !isChatBoxVisible;
        setChatBoxVisible(newVisibility);

        if (!newVisibility) {
            // Đóng kết nối WebSocket khi ẩn hộp trò chuyện
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        } else if (isLoggedIn) {
            // Lấy danh sách phòng nếu hộp trò chuyện được mở và người dùng đã đăng nhập
            fetchRooms();
        }
    };

    const handleConversationClick = (room) => {
        setCurrentRoom(room);
        setMessages([]); // Xóa tin nhắn cũ khi chuyển phòng
    };

    return (
        <div className={cx('wrapper', { 'wrapper-hidden': !isChatBoxVisible })}>
            {isChatBoxVisible ? (
                <Card
                    title={
                        <div className={cx('button-x-container')}>
                            <p style={{ fontWeight: 'bold', fontSize: '2.4rem', left: 0, position: 'relative' }}>
                                Chat
                            </p>
                            <Button
                                danger
                                type="link"
                                style={{ fontSize: '3rem', width: '30px', height: '30px' }}
                                icon={<CloseSquareOutlined style={{ fontSize: '2.4rem' }} />}
                                onClick={toggleChatBox}
                            ></Button>
                        </div>
                    }
                    styles={{ body: { padding: '0' } }}
                >
                    <MainContainer
                        style={{
                            height: '535px',
                            width: '100%',
                            fontSize: '1.6rem',
                        }}
                    >
                        <Sidebar position="left">
                            <ConversationList>
                                {rooms.map((room) => (
                                    <Conversation
                                        key={room.id_room}
                                        name={room.shop_name}
                                        info={room.last_message}
                                        active={currentRoom && currentRoom.id_room === room.id_room}
                                        onClick={() => handleConversationClick(room)}
                                    >
                                        <Avatar src={room.shop_avatar} />
                                    </Conversation>
                                ))}
                            </ConversationList>
                        </Sidebar>
                        <ChatContainer>
                            <ConversationHeader>
                                <ConversationHeader.Content
                                    userName={
                                        currentRoom ? currentRoom.shop_name : 'Chào mừng bạn đến với Pethome Chat'
                                    }
                                    info={
                                        currentRoom
                                            ? 'Last active 10 min ago'
                                            : 'Vui lòng chọn một cuộc trò chuyện để bắt đầu'
                                    }
                                />
                            </ConversationHeader>
                            <MessageList>
                                {currentRoom &&
                                    messages.map((msg, index) => (
                                        <Message
                                            key={index}
                                            model={{
                                                message: msg.content,
                                                sender: msg.is_shop ? 'Shop' : 'You',
                                                sentTime: msg.created_at,
                                                direction: msg.id_sender === idUser ? 'outgoing' : 'incoming',
                                                position: 'single',
                                            }}
                                        />
                                    ))}
                            </MessageList>
                            {currentRoom && (
                                <MessageInput
                                    placeholder="Gõ tin nhắn của bạn ở đây"
                                    onSend={(message) => sendMessage(message)}
                                />
                            )}
                        </ChatContainer>
                    </MainContainer>
                </Card>
            ) : (
                <Button
                    style={{
                        position: 'fixed',
                        bottom: '5px',
                        right: '5px',
                        color: 'orange',
                        fontWeight: 'bold',
                        fontSize: '2.4rem',
                        width: '120px',
                        height: '60px',
                    }}
                    icon={<WechatOutlined style={{ fontSize: '2.4rem' }} />}
                    onClick={toggleChatBox}
                >
                    Chat
                </Button>
            )}
        </div>
    );
}

export default ChatBox;
