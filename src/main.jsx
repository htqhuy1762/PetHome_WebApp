import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import GlobalStyles from './components/GlobalStyles/index.jsx';
import { TabProvider } from './components/TabProvider/index.jsx';
import { AuthProvider } from './components/AuthProvider/index.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalStyles>
            <AuthProvider>
                <TabProvider>
                    <App />
                </TabProvider>
            </AuthProvider>
        </GlobalStyles>
    </React.StrictMode>,
);
