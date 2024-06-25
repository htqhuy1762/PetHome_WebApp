import { authRequest, publicRequest } from '~/utils/httpRequestPetHome';

export const getPaymentMethods = async () => {
    try {
        const response = await publicRequest.get('/payment/methods');
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getUrlVNPay = async (data) => {
    try {
        const response = await authRequest.post('/payment/create_url', { params: data });
        return response;
    } catch (error) {
        return error.response;
    }
};