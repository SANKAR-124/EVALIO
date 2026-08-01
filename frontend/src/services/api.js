import axios from "axios";

const api = axios.create({
baseURL: import.meta.env.VITE_API_URL,
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