import api from "./api";

export const evaluatePrompt = async (rawPrompt) => {
    const sessionId = localStorage.getItem("session_id") || "";

    const response = await api.post("/api/evaluate", {
        raw_prompt: rawPrompt,
        session_id: sessionId,
    });

    // Save latest session
    if (response.data.session_id) {
        localStorage.setItem("session_id", response.data.session_id);
    }

    return response.data;
};