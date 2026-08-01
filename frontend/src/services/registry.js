import api from "./api";

export const getUseCases = async () => {
  const response = await api.get("/api/use-cases");
  return response.data;
};

export const getAgents = async () => {
  const response = await api.get("/api/agents");
  return response.data;
};