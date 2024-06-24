import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import GlobalStyles from './components/GlobalStyles/index.jsx';
import { AuthProvider } from './components/AuthProvider/index.jsx';
import { ChatProvider } from './components/ChatProvider/index.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalStyles>
            <AuthProvider>
                <GoogleOAuthProvider clientId="166899803953-spkq46d1namegkbkgigjmtrpikub48bv.apps.googleusercontent.com">
                    <ChatProvider>
                        <App />
                    </ChatProvider>
                </GoogleOAuthProvider>
            </AuthProvider>
        </GlobalStyles>
    </React.StrictMode>,
);
