import { createContext, useState } from 'react';

export const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [idShop, setIdShop] = useState(null);

    return <ChatContext.Provider value={{ idShop, setIdShop }}>{children}</ChatContext.Provider>;
}
