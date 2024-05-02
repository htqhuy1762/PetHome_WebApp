import { Spin } from 'antd';

function Loading() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" tip="loading" />
        </div>
    );
}

export default Loading;
