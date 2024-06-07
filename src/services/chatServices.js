import { authRequest } from '~/utils/httpRequestChat';

export const getUserRooms = async () => {
    try {
        const response = await authRequest.get('/api/user/rooms');
        return response;
    }
    catch(error) {
        return error.response;
    }
}

export const getShopRooms = async () => {
    try {
        const response = await authRequest.get('/api/shop/rooms');
        return response;
    }
    catch(error) {
        return error.response;
    }
}

export const createRoomUser = async (data) => {
    try {
        const response = await authRequest.get('/api/user/createRoom', {params: data});
        return response;
    }
    catch(error) {
        return error.response;
    }
}

export const createRoomShop = async (data) => {
    try {
        const response = await authRequest.get('/api/shop/createRoom', {params: data});
        return response;
    }
    catch(error) {
        return error.response;
    }
}

export const checkHavingMessage = async (id) => {
    try {
        const response = await authRequest.get(`/api/user/chat/shop/${id}`);
        return response;
    }
    catch(error) {
        return error.response;
    }
}