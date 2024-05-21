import { authRequest } from '~/utils/httpRequestPetHome';

export const getUser = async () => {
    try {
        const response = await authRequest.get('/api/user');
        return response;
    } catch (error) {
        return error.response;
    }
};

export const updateUser = async (data) => {
    try {
        const response = await authRequest.put('/api/user', data);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getUserAddress = async () => {
    try {
        const response = await authRequest.get('/api/user/addresses');
        return response;
    } catch (error) {
        return error.response;
    }
};

export const addUserAddress = async (data) => {
    try {
        const response = await authRequest.post('/api/user/addresses', data);
        return response;
    } catch (error) {
        return error.response;
    }
};


export const deleteUserAddress = async (addressId) => {
    try {
        const response = await authRequest.delete(`/api/user/addresses/${addressId}`);
        return response;
    } catch (error) {
        return error.response;
    }
};

