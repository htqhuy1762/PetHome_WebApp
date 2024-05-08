import * as httpRequestPetHome from '~/utils/httpRequestPetHome';

export const getItems = async (data) => {
    try {
        const response = await httpRequestPetHome.get('/items', { params: data });
        return response;
    }
    catch (error) {
        return error.response;
    }
}

export const getItemDetailById = async (id) => {
    try {
        const response = await httpRequestPetHome.get(`/items/${id}`);
        return response;
    }
    catch (error) {
        return error.response;
    }
}

export const getItemRatings = async (id, data) => {
    try {
        const response = await httpRequestPetHome.get(`/items/${id}/ratings`, { params: data });
        return response;
    }
    catch (error) {
        return error.response;
    }
}