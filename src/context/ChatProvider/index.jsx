import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [idShop, setIdShop] = useState(null);

    return <ChatContext.Provider value={{ idShop, setIdShop }}>{children}</ChatContext.Provider>;
}

ChatProvider.propTypes = {
    children: PropTypes.node.isRequired,
};