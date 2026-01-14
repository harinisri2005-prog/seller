const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    AUTH: {
        SIGNUP: `${API_BASE_URL}/api/auth/signup`,
        LOGIN: `${API_BASE_URL}/api/auth/login`
    },
    UPLOAD: {
        IMAGE: `${API_BASE_URL}/api/upload/image`,
        VIDEO: `${API_BASE_URL}/api/upload/video`,
        CREATE_POST: `${API_BASE_URL}/api/upload/create`,
        MY_POSTS: `${API_BASE_URL}/api/upload/my-posts`
    }
};

export default API_BASE_URL;
