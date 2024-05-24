import classNames from 'classnames/bind';
import styless from './ChatBox.module.scss';
import { AuthContext } from '~/components/AuthProvider/index.jsx';
import { useState, useContext } from 'react';
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
import { useEffect } from 'react';

const cx = classNames.bind(styless);
// [
//     {
//         "id_room": "d90908a5-014b-4e9d-953c-99270ad9618e",
//         "id_shop": "0004",
//         "shop_name": "Mật Pet Family",
//         "shop_avatar": "https://storage.googleapis.com/pethome/shop/0004/logo.jpg",
//         "is_read_by_user": false,
//         "last_message": "Test mess 5",
//         "created_at": "2024-05-11T09:21:27Z"
//     }
// ]

function ChatBox() {
    const { isLoggedIn } = useContext(AuthContext);
    const [isChatBoxVisible, setChatBoxVisible] = useState(false);
    const [rooms, setRooms] = useState([]);

    const toggleChatBox = () => {
        setChatBoxVisible(!isChatBoxVisible);
    };

    const sendMessage = (e) => {
        console.log(e);
    };

    const tabList = [
        {
            key: 'tab1',
            tab: 'Shop',
        },
        {
            key: 'tab2',
            tab: 'User',
        },
    ];

    useEffect(() => {
        const fetchRooms = async () => {
            const response = await chatServices.getUserRooms();
            if (response.status === 200) {
                setRooms(response.data);
            }
        };

        fetchRooms();
    }, []);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className={cx('wrapper', { 'wrapper-hidden': !isChatBoxVisible })}>
            {isChatBoxVisible ? (
                <Card
                    tabList={tabList}
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
                    {isChatBoxVisible && (
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
                                            active={true}
                                        >
                                            <Avatar src={room.shop_avatar} />
                                        </Conversation>
                                    ))}
                                </ConversationList>
                            </Sidebar>
                            <ChatContainer>
                                <ConversationHeader>
                                    <Avatar src="https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg" />
                                    <ConversationHeader.Content
                                        userName="John"
                                        info="last active 10 min ago"
                                    ></ConversationHeader.Content>
                                </ConversationHeader>
                                <MessageList>
                                    <Message
                                        model={{
                                            message: 'Hey John',
                                            sender: 'David',
                                            sentTime: '10 min ago',
                                            direction: 'outgoing',
                                            position: 'single',
                                        }}
                                    ></Message>
                                    <Message
                                        model={{
                                            message: 'Hey David',
                                            sender: 'David',
                                            sentTime: '10 min ago',
                                            direction: 'incoming',
                                            position: 'single',
                                        }}
                                    ></Message>
                                    <Message
                                        model={{
                                            message: 'How are you?',
                                            sender: 'David',
                                            sentTime: '10 min ago',
                                            direction: 'incoming',
                                            position: 'single',
                                        }}
                                    ></Message>
                                </MessageList>
                                <MessageInput placeholder="Type your message here" onSend={sendMessage}></MessageInput>
                            </ChatContainer>
                        </MainContainer>
                    )}
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
