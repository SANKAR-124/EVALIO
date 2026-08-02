import api from "./api";

export async function listSessions() {
  const response = await api.get("/api/sessions");
  return response.data;
}

export async function getSessionDetail(sessionId) {
  const response = await api.get(`/api/sessions/${sessionId}`);
  return response.data;
}

export async function deleteSession(sessionId) {
  const response = await api.delete(`/api/sessions/${sessionId}`);
  return response.data;
}
