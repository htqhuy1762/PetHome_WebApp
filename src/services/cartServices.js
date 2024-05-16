import * as httpRequestPetHome from '~/utils/httpRequestPetHome';

// ITEMS
export const getItemsCart = async (token) => {
    try {
        const response = await httpRequestPetHome.get('/api/cart/items', {
            headers: {
                'Authorization': token
            }
        });
        return response;
    }
    catch (error) {
        return error.response;
    }
};

export const addItemToCart = async (data, token) => {
    try {
        const response = await httpRequestPetHome.post('/api/items/cart', data, {
            headers: {
                'Authorization': token
            }
        });
        return response;
    }
    catch (error) {
        console.error('Error adding item to cart:', error.response);
        return error.response;
    }
}; 

export const removeItemFromCart = async (id, token) => {
    try {
        const response = await httpRequestPetHome.del(`/api/cart/items/${id}`, {
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

// PETS
export const getPetsCart = async (token) => {
    try {
        const response = await httpRequestPetHome.get('/api/cart/pets', {
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

export const addPetToCart = async (data, token) => {
    try {
        const response = await httpRequestPetHome.post('/api/pets/cart', data, {
            headers: {
                'Authorization': token
            }
        });
        return response;
    }
    catch (error) {
        console.error('Error adding pet to cart:', error.response);
        return error.response;
    }
}; 

export const removePetFromCart = async (id, token) => {
    try {
        const response = await httpRequestPetHome.del(`/api/cart/pets/${id}`, {
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