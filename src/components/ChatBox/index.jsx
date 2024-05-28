import { useState, useEffect, useContext } from 'react';
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
    const { isLoggedIn, user } = useContext(AuthContext);
    const [isChatBoxVisible, setChatBoxVisible] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [messages, setMessages] = useState([]);

    const toggleChatBox = () => {
        setChatBoxVisible(!isChatBoxVisible);
    };

    // const handleSendMessage = (message) => {
    //     if (currentRoom) {
    //         sendChatMessage(currentRoom.id_room, message);
    //     }
    // };

    // useEffect(() => {
    //     const fetchRooms = async () => {
    //         const response = await chatServices.getUserRooms();
    //         if (response.status === 200) {
    //             setRooms(response.data);
    //         }
    //     };

    //     fetchRooms();
    // }, []);

    // useEffect(() => {
    //     if (currentRoom) {
    //         joinChatRoom(currentRoom.id_room, user.id);
    //         receiveChatMessage((message) => {
    //             setMessages((prevMessages) => [...prevMessages, message]);
    //         });

    //         return () => {
    //             exitChatRoom(currentRoom.id_room);
    //         };
    //     }
    // }, [currentRoom, user.id]);

    if (!isLoggedIn) {
        return null;
    }

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
                            height: '480px',
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
                                        lastSenderName="John"
                                        info={room.last_message}
                                        active={currentRoom && currentRoom.id_room === room.id_room}
                                        onClick={() => setCurrentRoom(room)}
                                    >
                                        <Avatar src={room.shop_avatar} />
                                    </Conversation>
                                ))}
                            </ConversationList>
                        </Sidebar>
                        <ChatContainer>
                            {currentRoom ? (
                                <>
                                    <ConversationHeader>
                                        <Avatar src={currentRoom.shop_avatar} />
                                        <ConversationHeader.Content
                                            userName={currentRoom.shop_name}
                                            info="Last active 10 min ago"
                                        />
                                    </ConversationHeader>
                                    <MessageList>
                                        {messages.map((msg, index) => (
                                            <Message
                                                key={index}
                                                model={{
                                                    message: msg.content,
                                                    sender: msg.id_sender === user.id ? 'You' : 'Shop',
                                                    sentTime: msg.created_at,
                                                    direction: msg.id_sender === user.id ? 'outgoing' : 'incoming',
                                                    position: 'single',
                                                }}
                                            />
                                        ))}
                                    </MessageList>
                                    <MessageInput placeholder="Gõ tin nhắn của bạn ở đây" onSend={handleSendMessage} />
                                </>
                            ) : (
                                <div>Chọn một cuộc trò chuyện để bắt đầu chat</div>
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
