import { publicRequest } from '~/utils/httpRequestPetHome';

export const getPaymentMethods = async () => {
    try {
        const response = await publicRequest.get('/payment/methods');
        return response;
    } catch (error) {
        return error.response;
    }
};
