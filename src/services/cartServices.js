import { authRequest } from '~/utils/httpRequestPetHome';

// ITEMS
export const getItemsCart = async () => {
    try {
        const response = await authRequest.get('/api/cart/items');
        return response;
    } catch (error) {
        return error.response;
    }
};

export const addItemToCart = async (data) => {
    try {
        const response = await authRequest.post('/api/items/cart', data);
        return response;
    } catch (error) {
        console.error('Error adding item to cart:', error.response);
        return error.response;
    }
}; 

export const removeItemFromCart = async (id) => {
    try {
        const response = await authRequest.delete(`/api/cart/items/${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
};

// PETS
export const getPetsCart = async () => {
    try {
        const response = await authRequest.get('/api/cart/pets');
        return response;
    } catch (error) {
        return error.response;
    }
};

export const addPetToCart = async (data) => {
    try {
        const response = await authRequest.post('/api/pets/cart', data);
        return response;
    } catch (error) {
        console.error('Error adding pet to cart:', error.response);
        return error.response;
    }
}; 

export const removePetFromCart = async (id) => {
    try {
        const response = await authRequest.delete(`/api/cart/pets/${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
};