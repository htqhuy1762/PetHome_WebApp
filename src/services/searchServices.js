import * as httpRequestPetHome from '~/utils/httpRequestPetHome';

export const searchPets = async (data) => {
    try {
        const response = await httpRequestPetHome.get('/pets', { params: data });
        return response;
    }
    catch (error) {
        return error.response;
    }
}