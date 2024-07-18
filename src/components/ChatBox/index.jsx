import { useState, useEffect, useContext, useRef } from 'react';
import classNames from 'classnames/bind';
import styless from './ChatBox.module.scss';
import { AuthContext } from '~/context/AuthProvider/index.jsx';
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
import { Button, Card, Empty } from 'antd';
import { WechatOutlined, CloseSquareOutlined } from '@ant-design/icons';
import * as chatServices from '~/services/chatServices';
import * as shopServices from '~/services/shopServices';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import PropTypes from 'prop-types';
import img_empty_chat from '~/assets/images/icon_empty_chat.png';

dayjs.extend(utc);
dayjs.extend(timezone);

const formatDateTime = (isoDateString) => {
    if (!isoDateString) {
        return '';
    }
    const timezone = 'Asia/Ho_Chi_Minh';
    const date = dayjs.utc(isoDateString).tz(timezone);

    const today = dayjs().tz(timezone);

    const isSameDay = date.isSame(today, 'day');

    if (isSameDay) {
        return date.format('HH:mm');
    } else {
        return date.format('DD/MM/YYYY');
    }
};

const cx = classNames.bind(styless);

function ChatBox({ shopInfo }) {
    const { isLoggedIn } = useContext(AuthContext);
    const [accountTypeChecked, setAccountTypeChecked] = useState(false);
    const [isChatBoxVisible, setChatBoxVisible] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [currentRoomUser, setCurrentRoomUser] = useState(null);
    const [currentRoomShop, setCurrentRoomShop] = useState(null);
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);
    const [idUser, setIdUser] = useState(null);
    const [idShop, setIdShop] = useState(null);
    const [isShop, setIsShop] = useState(false);
    const [chatType, setChatType] = useState('user'); // ['user', 'shop']
    const [isLoadingMessages, setLoadingMessages] = useState(false);

    useEffect(() => {
        // Reset loading state when messages change
        setLoadingMessages(messages.length === 0);
    }, [messages]);

    const fetchListRoomUser = async () => {
        try {
            const response = await chatServices.getUserRooms();
            if (response.status === 200) {
                setRooms(response.data);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const fetchListRoomShop = async () => {
        try {
            const response = await chatServices.getShopRooms();
            if (response.status === 200) {
                setRooms(response.data);
            }
        } catch (error) {
            console.error('Error fetching shop rooms:', error);
        }
    };

    const checkAccountType = async () => {
        try {
            const response = await shopServices.checkIsActiveShop();
            if (response.status === 200 && response.data.status === 'active') {
                setIsShop(true);
                if (chatType === 'user') {
                    fetchListRoomUser();
                } else {
                    fetchListRoomShop();
                }
            } else {
                setIsShop(false);
                fetchListRoomUser();
            }
            setAccountTypeChecked(true);
        } catch (error) {
            console.error('Error checking account type:', error);
        }
    };

    useEffect(() => {
        const initializeChatBox = async () => {
            await checkAccountType();
            if (isChatBoxVisible && shopInfo) {
                // Thêm điều kiện shopInfo
                try {
                    const response = await chatServices.createRoomUser({ id_shop: shopInfo });
                    if (response.status === 200) {
                        const { id_room, id_user } = response.data;
                        setCurrentRoomUser(response.data);
                        setCurrentRoomShop(null);
                        setMessages([]);
                        setIdUser(id_user);

                        const wsURL = `${import.meta.env.VITE_APP_BASE_URL_CHAT_WS}/${id_room}?id_user=${id_user}`;
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
                } catch (error) {
                    console.error('Error initializing chat box:', error);
                }
            }
        };

        if (shopInfo !== null) {
            initializeChatBox();
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [shopInfo, isChatBoxVisible]);

    useEffect(() => {
        if (shopInfo !== null && !isChatBoxVisible) {
            setChatBoxVisible(true);
        }
    }, [shopInfo]);

    useEffect(() => {
        const fetchRoomUser = async () => {
            if (currentRoomUser) {
                const response = await chatServices.createRoomUser({ id_shop: currentRoomUser.id_shop });

                if (response.status === 200) {
                    const { id_room, id_user } = response.data;
                    setIdUser(id_user);
                    const wsURL = `${import.meta.env.VITE_APP_BASE_URL_CHAT_WS}/${id_room}?id_user=${id_user}`;
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
            if (socketRef.current) {
                console.log('Component unmounted or room changed, closing WebSocket');
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [currentRoomUser]);

    useEffect(() => {
        const fetchRoomShop = async () => {
            if (currentRoomShop) {
                const response = await chatServices.createRoomShop({ id_user: currentRoomShop.id_user });

                if (response.status === 200) {
                    const { id_room, id_shop } = response.data;
                    setIdShop(id_shop);
                    const wsURL = `${import.meta.env.VITE_APP_BASE_URL_CHAT_WS}/${id_room}?id_shop=${id_shop}`;
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

        fetchRoomShop();

        return () => {
            if (socketRef.current) {
                console.log('Component unmounted or room changed, closing WebSocket');
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, [currentRoomShop]);

    const sendMessage = (messageContent) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(messageContent);
        } else {
            // Handle the case when the WebSocket is not open.
            console.error('Cannot send message because the WebSocket is not open.');
        }
    };

    const toggleChatBox = async () => {
        const newVisibility = !isChatBoxVisible;

        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
        setCurrentRoomUser(null);
        setCurrentRoomShop(null);
        setMessages([]);
        shopInfo = null;

        if (newVisibility) {
            if (isLoggedIn) {
                await checkAccountType();
            }
        }

        setChatBoxVisible(newVisibility);
    };

    const handleConversationClickUser = (room) => {
        // Close the current WebSocket connection before switching rooms.
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
        setCurrentRoomUser(room);
        setCurrentRoomShop(null);
        setMessages([]);
    };

    const handleConversationClickShop = (room) => {
        // Close the current WebSocket connection before switching rooms.
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
        setCurrentRoomShop(room);
        setCurrentRoomUser(null);
        setMessages([]);
    };

    const handleChatTypeChange = (type) => {
        setChatType(type);
        setRooms([]);
        setMessages([]);

        if (type === 'user') {
            fetchListRoomUser();
            setCurrentRoomShop(null);
        } else {
            fetchListRoomShop();
            setCurrentRoomUser(null);
        }
    };

    return (
        <div className={cx('wrapper', { 'wrapper-hidden': !isChatBoxVisible })}>
            {isChatBoxVisible && accountTypeChecked ? (
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
                            {isShop ? (
                                <>
                                    <div className={cx('chat-type-buttons')}>
                                        <Button
                                            style={{
                                                borderRadius: '18px',
                                                height: '36px',
                                                marginRight: '7px',
                                                background: chatType === 'user' ? '#1890ff' : 'none',
                                                color: chatType === 'user' ? 'white' : '#1890ff',
                                            }}
                                            type=""
                                            onClick={() => handleChatTypeChange('user')}
                                        >
                                            Cá nhân
                                        </Button>

                                        <Button
                                            style={{
                                                borderRadius: '18px',
                                                height: '36px',
                                                background: chatType === 'shop' ? '#1890ff' : 'none',
                                                color: chatType === 'shop' ? 'white' : '#1890ff',
                                            }}
                                            type=""
                                            onClick={() => handleChatTypeChange('shop')}
                                        >
                                            Cửa hàng
                                        </Button>
                                    </div>
                                    {chatType === 'user' ? (
                                        <ConversationList>
                                            {rooms.map((room) => (
                                                <Conversation
                                                    key={room.id_room}
                                                    name={room.shop_name}
                                                    info={room.last_message}
                                                    lastActivityTime={<span>{formatDateTime(room.created_at)}</span>}
                                                    active={currentRoomUser && currentRoomUser.id_room === room.id_room}
                                                    onClick={() => handleConversationClickUser(room)}
                                                    unreadDot={!room.is_read_by_user}
                                                >
                                                    <Avatar
                                                        src={
                                                            room?.shop_avatar ||
                                                            'https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg'
                                                        }
                                                    />
                                                </Conversation>
                                            ))}
                                        </ConversationList>
                                    ) : (
                                        <ConversationList>
                                            {rooms.map((room) => (
                                                <Conversation
                                                    key={room.id_room}
                                                    name={room.user_name}
                                                    info={room.last_message}
                                                    lastActivityTime={<span>{formatDateTime(room.created_at)}</span>}
                                                    active={currentRoomShop && currentRoomShop.id_room === room.id_room}
                                                    onClick={() => handleConversationClickShop(room)}
                                                    unreadDot={!room.is_read_by_shop}
                                                >
                                                    <Avatar
                                                        src={
                                                            room?.user_avatar ||
                                                            'https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg'
                                                        }
                                                    />
                                                </Conversation>
                                            ))}
                                        </ConversationList>
                                    )}
                                </>
                            ) : (
                                <ConversationList>
                                    {rooms.map((room) => (
                                        <Conversation
                                            key={room.id_room}
                                            name={room.shop_name}
                                            info={room.last_message}
                                            lastActivityTime={<span>{formatDateTime(room.created_at)}</span>}
                                            active={currentRoomUser && currentRoomUser.id_room === room.id_room}
                                            onClick={() => handleConversationClickUser(room)}
                                            unreadDot={!room.is_read_by_user}
                                        >
                                            <Avatar
                                                src={
                                                    room?.shop_avatar ||
                                                    'https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg'
                                                }
                                            />
                                        </Conversation>
                                    ))}
                                </ConversationList>
                            )}
                        </Sidebar>
                        <ChatContainer>
                            <ConversationHeader>
                                {isShop ? (
                                    <ConversationHeader.Content
                                        userName={
                                            currentRoomUser
                                                ? currentRoomUser.shop_name
                                                : currentRoomShop
                                                ? currentRoomShop.user_name
                                                : 'Chào mừng bạn đến với Pethome Chat'
                                        }
                                        info={
                                            currentRoomUser || currentRoomShop
                                                ? 'Thường trả lời ngay'
                                                : 'Vui lòng chọn một cuộc trò chuyện để bắt đầu'
                                        }
                                    />
                                ) : (
                                    <ConversationHeader.Content
                                        userName={
                                            currentRoomUser
                                                ? currentRoomUser.shop_name
                                                : 'Chào mừng bạn đến với Pethome Chat'
                                        }
                                        info={
                                            currentRoomUser
                                                ? 'Thường trả lời ngay'
                                                : 'Vui lòng chọn một cuộc trò chuyện để bắt đầu'
                                        }
                                    />
                                )}
                            </ConversationHeader>
                            <MessageList>
                                {!isLoadingMessages && (currentRoomUser || currentRoomShop) && messages.length > 0 ? (
                                    messages.map((msg, index) => (
                                        <Message
                                            key={index}
                                            model={{
                                                message: msg.content,
                                                sender: msg.is_shop ? 'Shop' : 'You',
                                                sentTime: msg.created_at,
                                                direction:
                                                    (chatType === 'shop' && msg.id_sender === idShop) ||
                                                    (chatType === 'user' && msg.id_sender === idUser)
                                                        ? 'outgoing'
                                                        : 'incoming',
                                                position: 'single',
                                            }}
                                        />
                                    ))
                                ) : (
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            height: '100%',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {!currentRoomUser && !currentRoomShop ? null : (
                                            <Empty
                                                image={img_empty_chat}
                                                description="Không có tin nhắn, hãy bắt đầu trò chuyện ngay!"
                                            />
                                        )}
                                    </div>
                                )}
                            </MessageList>
                            {(currentRoomUser || currentRoomShop) && (
                                <MessageInput
                                    placeholder="Gõ tin nhắn của bạn ở đây"
                                    onSend={(message) => sendMessage(message)}
                                    //attachButton={false}
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

ChatBox.propTypes = {
    shopInfo: PropTypes.string,
};

export default ChatBox;
