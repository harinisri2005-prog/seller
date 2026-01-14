import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const API = axios.create({
    baseURL: `${API_BASE_URL}/api/upload`
});

export const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return API.post("/image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const uploadVideo = (file) => {
    const formData = new FormData();
    formData.append("video", file);
    return API.post("/video", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};
