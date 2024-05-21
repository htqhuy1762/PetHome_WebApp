import { authRequest } from '~/utils/httpRequestPetHome';

export const registerShop = async (data) => {
    try {
        const response = await authRequest.post('/api/shop/submit', data);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const checkUserIsShop = async () => {
    try {
        const response = await authRequest.get('/api/shop/check');
        return response;
    } catch (error) {
        return error.response;
    }
};
