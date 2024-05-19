import * as httpRequestPetHome from '~/utils/httpRequestPetHome';

export const registerShop = async (data, token) => {
    try {
        const response = await httpRequestPetHome.post('/api/shop/submit', data, {
            headers: {
                Authorization: token,
            },
        }
        );
        return response;
    }
    catch (error) {
        return error.response;
    }
}

export const checkUserIsShop = async (token) => {
    try {
        const response = await httpRequestPetHome.get('/api/shop/check', {
            headers: {
                Authorization: token,
            },
        });
        return response;
    }
    catch (error) {
        return error.response;
    }
}