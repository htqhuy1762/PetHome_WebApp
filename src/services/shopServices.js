import { authRequest } from '~/utils/httpRequestPetHome';

export const registerShop = async (data) => {
    try {
        const response = await authRequest.post('/api/shop/submit', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const checkIsRegisterShop = async () => {
    try {
        const response = await authRequest.get('/api/shop/check');
        return response;
    } catch (error) {
        return error.response;
    }
};

export const checkIsActiveShop = async () => {
    try {
        const response = await authRequest.get('/api/shop/status');
        return response;
    } catch (error) {
        return error.response;
    }
}