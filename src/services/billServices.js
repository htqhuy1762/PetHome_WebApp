import { authRequest } from '~/utils/httpRequestPetHome';

export const createBill = async (data) => {
    try {
        const response = await authRequest.post('/api/user/bills/create', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getUserBills = async (data) => {
    try {
        const response = await authRequest.get('/api/user/bills', { params: data });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getShopBills = async (data) => {
    try {
        const response = await authRequest.get('/api/shop/bills', { params: data });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const updateUserBillStatus = async (id, data) => {
    try {
        const response = await authRequest.put(`/api/user/bills/${id}`, data);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const updateShopBillStatus = async (id, data) => {
    try {
        const response = await authRequest.put(`/api/shop/bills/${id}`, data);
        return response;
    } catch (error) {
        return error.response;
    }
};
