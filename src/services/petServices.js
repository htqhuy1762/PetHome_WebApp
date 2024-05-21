import { authRequest, publicRequest } from '~/utils/httpRequestPetHome';

export const getPets = async (data) => {
    try {
        const response = await publicRequest.get('/pets', { params: data });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getPetDetailById = async (id) => {
    try {
        const response = await publicRequest.get(`/pets/${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getPetRatings = async (id, data) => {
    try {
        const response = await publicRequest.get(`/pets/${id}/ratings`, { params: data });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getPetSpecies = async () => {
    try {
        const response = await publicRequest.get('/pet/species');
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getPetAges = async () => {
    try {
        const response = await publicRequest.get('/pet/ages');
        return response;
    } catch (error) {
        return error.response;
    }
};

export const checkRatedOrNot = async (id) => {
    try {
        const response = await authRequest.get(`/api/pets/${id}/rate`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const postPetRating = async (id, data) => {
    try {
        const response = await authRequest.post(`/api/pets/${id}/rate`, data);
        return response;
    } catch (error) {
        return error.response;
    }
};
