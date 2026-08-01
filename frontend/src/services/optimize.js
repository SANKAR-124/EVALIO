import api from "./api";

export async function optimizePrompt(prompt) {
  const response = await api.post("/api/optimize", {
    prompt,
  });

  return response.data;
}