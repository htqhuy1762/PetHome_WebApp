import { authRequest, publicRequest } from '~/utils/httpRequestPetHome';

export const getServiceTypes = async () => {
    try {
        const response = await publicRequest.get('/service/types');
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getServiceTypeDetail = async (id) => {
    try {
        const response = await publicRequest.get(`/service/types/${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getServiceDetailById = async (id) => {
    try {
        const response = await publicRequest.get(`/services/${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getAllServicesByType = async (data) => {
    try {
        const response = await publicRequest.get('/services', {params: data});
        return response;
    } catch (error) {
        return error.response;
    }
}

export const getServiceRatings = async (id) => {
    try {
        const response = await publicRequest.get(`/services/${id}/ratings`);
        return response;
    } catch (error) {
        return error.response;
    }
}

export const checkRatedOrNot = async (id) => {
    try {
        const response = await authRequest.get(`/api/services/${id}/rate`);
        return response;
    } catch (error) {
        return error.response;
    }
}

export const postServiceRating = async (id, data) => {
    try {
        const response = await authRequest.post(`/api/services/${id}/rate`, data);
        return response;
    } catch (error) {
        return error.response;
    }
}