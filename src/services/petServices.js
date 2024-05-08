import * as httpRequestPetHome from '~/utils/httpRequestPetHome';

export const getPets = async (data) => {
    try {
        const response = await httpRequestPetHome.get('/pets', { params: data });
        return response;
    }
    catch (error) {
        return error.response;
    }
}

export const getPetDetailById = async (id) => {
    try {
        const response = await httpRequestPetHome.get(`/pets/${id}`);
        return response;
    }
    catch (error) {
        return error.response;
    }
}

export const getPetRatings = async (id, data) => {
    try {
        const response = await httpRequestPetHome.get(`/pets/${id}/ratings`, { params: data });
        return response;
    }
    catch (error) {
        return error.response;
    }
}

export const getPetSpecies = async () => {
    try {
        const response = await httpRequestPetHome.get('/pet/species');
        return response;
    }
    catch (error) {
        return error.response;
    }
}

export const getPetAges = async () => {
    try {
        const response = await httpRequestPetHome.get('/pet/ages');
        return response;
    }
    catch (error) {
        return error.response;
    }
}

export const checkRatedOrNot = async (id, token) => {
    try {
        const response = await httpRequestPetHome.get(`/api/pets/${id}/rate`, {
            headers: {
                'Authorization': token
            }
        });
        return response;
    }
    catch (error) {
        return error.response;
    }
}

export const postPetRating = async (id, data, token) => {
    try {
        const response = await httpRequestPetHome.post(`/api/pets/${id}/rate`, data, {
            headers: {
                'Authorization': token
            }
        });
        return response;
    }
    catch (error) {
        return error.response;
    }
}