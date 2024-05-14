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

const cx = classNames.bind(styless);

function ChatBox() {
    const { isLoggedIn } = useContext(AuthContext);
    const [isChatBoxVisible, setChatBoxVisible] = useState(false);

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
                                    <Conversation name="John" lastSenderName="John" info="hello" active={true}>
                                        <Avatar src="https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg" />
                                    </Conversation>
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
