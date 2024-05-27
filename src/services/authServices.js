import * as httpRequestAuth from '~/utils/httpRequestAuth';

export const login = async (data) => {
    try {
        const response = await httpRequestAuth.post('/jwt/login', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const register = async (data) => {
    try {
        const response = await httpRequestAuth.post('/jwt/register', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const sendCodeEmail = async (data) => {
    try {
        const response = await httpRequestAuth.post('/jwt/send_code', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const verifyCodeEmail = async (data, token) => {
    try {
        const response = await httpRequestAuth.post('/jwt/verify_code', data, {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getNewAccessToken = async () => {
    try {
        const response = await httpRequestAuth.get('/refresh', {
            headers: {
                Authorization: localStorage.getItem('refreshToken'),
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const logout = async () => {
    try {
        const response = await httpRequestAuth.get('/jwt/logout');
        return response;
    } catch (error) {
        return error.response;
    }
};

export const authorizeToken = async () => {
    try {
        const response = await httpRequestAuth.get('/authorize', {
            headers: {
                Authorization: localStorage.getItem('accessToken'),
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};
