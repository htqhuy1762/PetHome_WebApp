import { authRequest, publicRequest } from '~/utils/httpRequestPetHome';

export const registerShop = async (data) => {
    try {
        const response = await authRequest.post('/api/shop/submit', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const checkIsRegisterShop = async () => {
    try {
        const response = await authRequest.get('/api/shop/check');
        return response;
    } catch (error) {
        return error.response;
    }
};

export const checkIsActiveShop = async () => {
    try {
        const response = await authRequest.get('/api/shop/status');
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getShopInfo = async (id) => {
    try {
        const response = await publicRequest.get(`/shops/${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getShopDetail = async () => {
    try {
        const response = await authRequest.get(`/api/shop`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const updateShopLogo = async (data) => {
    try {
        const response = await authRequest.put(`/api/shop/logo`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const addShopAddress = async (data) => {
    try {
        const response = await authRequest.post(`/api/shop/address`, data);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const deleteShopAddress = async (id) => {
    try {
        const response = await authRequest.delete(`/api/shop/address/${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
};

// Management Pet
export const getShopPets = async (id, data) => {
    try {
        const response = await publicRequest.get(`/shops/${id}/pets`, { params: data });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const addPetRequest = async (data) => {
    try {
        const response = await authRequest.post('/api/shop/pets', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const deleteShopPet = async (id) => {
    try {
        const response = await authRequest.post(`/api/shop/pets/${id}/remove`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const updateShopPet = async (id, data) => {
    try {
        const response = await authRequest.put(`/api/shop/pets/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

//Management Item

export const getShopItems = async (id, data) => {
    try {
        const response = await publicRequest.get(`/shops/${id}/items`, { params: data });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const addItemRequest = async (data) => {
    try {
        const response = await authRequest.post('/api/shop/items', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const deleteShopItem = async (id) => {
    try {
        const response = await authRequest.post(`/api/shop/items/${id}/remove`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const addItemDetailRequest = async (id, data) => {
    try {
        const response = await authRequest.post(`/api/shop/items/${id}/detail/add`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const updateItemDetail = async (idItem, idDetail, data) => {
    try {
        const response = await authRequest.put(`/api/shop/items/${idItem}/detail/${idDetail}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const deleteItemDetail = async (idItem, idDetail) => {
    try {
        const response = await authRequest.delete(`/api/shop/items/${idItem}/detail/${idDetail}`);
        return response;
    } catch (error) {
        return error.response;
    }
};

// Management Services
export const getShopServices = async (id, data) => {
    try {
        const response = await publicRequest.get(`/shops/${id}/services`, { params: data });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const addServiceRequest = async (data) => {
    try {
        const response = await authRequest.post('/api/shop/services', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const deleteShopService = async (id) => {
    try {
        const response = await authRequest.post(`/api/shop/services/${id}/remove`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const updatePriceService = async (id, data) => {
    try {
        const response = await authRequest.put(`/api/shop/services/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const updateAddressService = async (id, data) => {
    try {
        const response = await authRequest.put(`/api/shop/services/${id}/addresses`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getServiceGallery = async (id) => {
    try {
        const response = await authRequest.get(`/api/shop/services/${id}/gallery`);
        return response;
    } catch (error) {
        return error.response;
    }
};

export const addServiceGallery = async (id, data) => {
    try {
        const response = await authRequest.post(`/api/shop/services/${id}/gallery`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const updateGalleryImage = async (idService, idImage, status) => {
    try {
        const response = await authRequest.put(`/api/shop/services/${idService}/gallery/${idImage}?status=${status}`);
        return response;
    } catch (error) {
        return error.response;
    }
};
