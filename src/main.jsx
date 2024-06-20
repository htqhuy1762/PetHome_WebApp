import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import GlobalStyles from './components/GlobalStyles/index.jsx';
import { AuthProvider } from './components/AuthProvider/index.jsx';
import { ChatProvider } from './components/ChatProvider/index.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalStyles>
            <AuthProvider>
                <ChatProvider>
                    <App />
                </ChatProvider>
            </AuthProvider>
        </GlobalStyles>
        ,
    </React.StrictMode>,
);
