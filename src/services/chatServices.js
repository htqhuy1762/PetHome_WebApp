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