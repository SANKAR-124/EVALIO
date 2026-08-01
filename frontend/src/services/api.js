import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically attach Workspace ID
api.interceptors.request.use((config) => {
    const workspaceId = localStorage.getItem("workspace");

    if (workspaceId) {
        config.headers["X-Workspace-Id"] = workspaceId;
    }

    return config;
});

export default api;