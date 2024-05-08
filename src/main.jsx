import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import GlobalStyles from './components/GlobalStyles/index.jsx';
import { TabProvider } from './components/TabProvider/index.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalStyles>
            <TabProvider>
                <App />
            </TabProvider>
        </GlobalStyles>
    </React.StrictMode>,
);
