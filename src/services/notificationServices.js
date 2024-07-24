import { authRequest } from '~/utils/httpRequestPetHome';

export const getNotification = async () => {
    try {
        const response = await authRequest.get('/api/user/notifications');
        return response;
    } catch (error) {
        return error.response;
    }
};


export const updateReadNotification = async(id) => {
    try {
        const response = await authRequest.put(`/api/user/notifications/read?id=${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
}

export const updateShowNotification = async(id) => {
    try {
        const response = await authRequest.put(`/api/user/notifications/showed?id=${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
}

export const getUnreadNotification = async() => {
    try {
        const response = await authRequest.get('/api/user/notifications/count');
        return response;
    } catch (error) {
        return error.response;
    }
}