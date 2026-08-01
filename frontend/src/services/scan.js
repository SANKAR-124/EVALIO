import api from "./api";

export async function scanPrompt(prompt) {
  const response = await api.post("/api/scan", {
    prompt,
  });

  return response.data;
}