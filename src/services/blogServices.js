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

export const getUserBlogs = async (data) => {
    try {
        const response = await authRequest.get('/api/user/blogs', { params: data });
        return response;
    } catch (error) {
        return error.response;
    }
}

export const updateBlog = async (id, data) => {
    try {
        const response = await authRequest.put(`/api/user/blogs/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response;
    } catch (error) {
        return error.response;
    }
}

export const deleteBlog = async (id) => {
    try {
        const response = await authRequest.delete(`/api/user/blogs/${id}`);
        return response;
    } catch (error) {
        return error.response;
    }
}