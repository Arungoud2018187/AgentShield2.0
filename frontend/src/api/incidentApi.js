import api from "./axios";

export async function createIncident(data) {
  const response = await api.post("/api/incidents", data);
  return response.data;
}

export async function getIncidents() {
  const response = await api.get("/api/incidents");
  return response.data;
}

export async function getIncident(incidentId) {
  const response = await api.get(`/api/incidents/${incidentId}`);
  return response.data;
}

export async function downloadIncidentFile(incidentId) {
  const response = await api.get(`/api/incidents/${incidentId}/download`, {
    responseType: "blob",
  });
  return response.data;
}