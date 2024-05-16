import * as httpRequestPetHome from '~/utils/httpRequestPetHome';

export const getUser = async (accessToken) => {
    //
    
    //
    try {
        const response = await httpRequestPetHome.get('/api/user', {
            headers: {
                'Authorization': accessToken
            }
        });
        return response;
    }
    catch (error) {
        return error.response;
    }
}

export const updateUser = async (data, accessToken) => {
    const response = await httpRequestPetHome.put('/api/user', data, {
        headers: {
            'Authorization': accessToken,
        },
    });
    return response;
}