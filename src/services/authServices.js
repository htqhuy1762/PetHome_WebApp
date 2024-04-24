import * as httpRequest from '~/utils/httpRequest';

export const login = async (data) => {
    try {
        const response = await httpRequest.post('/jwt/login', data);
        return response;
    }
    catch (error) {
        return error.response;
    }
};

export const register = async (data) => {
    try {
        const response = await httpRequest.post('/auth/register', data);
        return response;
    }
    catch (error) {
        return error.response;
    }
}
