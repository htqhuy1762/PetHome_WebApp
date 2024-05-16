import * as httpRequestPetHome from '~/utils/httpRequestPetHome';

export const getItems = async (data) => {
    try {
        const response = await httpRequestPetHome.get('/items', { params: data });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getItemDetailById = async (id) => {
    try {
        const response = await httpRequestPetHome.get(`/items/${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getItemRatings = async (id, data) => {
    try {
        const response = await httpRequestPetHome.get(`/items/${id}/ratings`, { params: data });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getItemTypes = async () => {
    try {
        const response = await httpRequestPetHome.get('/item/types');
        return response;
    } catch (error) {
        return error.response;
    }
};

export const checkRatedOrNot = async (id, token) => {
    try {
        const response = await httpRequestPetHome.get(`/api/items/${id}/rate`, {
            headers: {
                Authorization: token,
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const postItemRating = async (id, data, token) => {
    try {
        const response = await httpRequestPetHome.post(`/api/items/${id}/rate`, data, {
            headers: {
                Authorization: token,
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};