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

export const getItemDetail = async (id) => {
    try {
        const response = await httpRequestPetHome.get(`/items/${id}`);
        return response;
    }
    catch (error) {
        return error.response;
    }
}