import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import GlobalStyles from './components/GlobalStyles/index.jsx';
import { AuthProvider } from './context/AuthProvider/index.jsx';
import { ChatProvider } from './context/ChatProvider/index.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalStyles>
            <AuthProvider>
                <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_CLIENT_ID_GOOGLE}>
                    <ChatProvider>
                        <App />
                    </ChatProvider>
                </GoogleOAuthProvider>
            </AuthProvider>
        </GlobalStyles>
    </React.StrictMode>,
);
