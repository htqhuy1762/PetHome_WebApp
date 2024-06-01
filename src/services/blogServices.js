import { authRequest, publicRequest } from '~/utils/httpRequestPetHome';


export const getBlogs = async (data) => {
    try {
        const response = await publicRequest.get('/blogs', { params: data});
        return response;
    } catch (error) {
        return error.response;
    }
}

export const addBlog = async (data) => {
    try {
        const response = await authRequest.post('/api/blogs', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        return error.response;
    }
}

export const getNumberLikeBlog = async (id) => {
    try {
        const response = await publicRequest.get(`/blogs/${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
}

export const isLikedBlog = async (id) => {
    try {
        const response = await authRequest.get(`/api/blogs/${id}/like`);
        return response;
    } catch (error) {
        return error.response;
    }
}

export const toggleLikeBlog = async (id) => {
    try {
        const response = await authRequest.post(`/api/blogs/${id}/like`);
        return response;
    } catch (error) {
        return error.response;
    }
}