import api from "./axios";

export async function createIncident(data) {
  const response = await api.post("/api/incidents", data);
  return response.data;
}

export async function getIncidents() {
  const response = await api.get("/api/incidents");
  return response.data;
}