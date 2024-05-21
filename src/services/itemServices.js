import { authRequest, publicRequest } from '~/utils/httpRequestPetHome';

export const getItems = async (data) => {
    try {
        const response = await publicRequest.get('/items', { params: data });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getItemDetailById = async (id) => {
    try {
        const response = await publicRequest.get(`/items/${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getItemRatings = async (id, data) => {
    try {
        const response = await publicRequest.get(`/items/${id}/ratings`, { params: data });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getItemTypes = async () => {
    try {
        const response = await publicRequest.get('/item/types');
        return response;
    } catch (error) {
        return error.response;
    }
};

export const checkRatedOrNot = async (id) => {
    try {
        const response = await authRequest.get(`/api/items/${id}/rate`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const postItemRating = async (id, data) => {
    try {
        const response = await authRequest.post(`/api/items/${id}/rate`, data);
        return response;
    } catch (error) {
        return error.response;
    }
};
