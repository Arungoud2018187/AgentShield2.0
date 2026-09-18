import api from "./axios";

export async function askSecurityCopilot(prompt, eventId = null, incidentId = null, incidentData = null) {
  const response = await api.post("/api/copilot/chat", {
    prompt,
    event_id: eventId,
    incident_id: incidentId,
    incident_data: incidentData,
  });
  return response.data;
}

export async function getCopilotQuickPrompts() {
  const response = await api.get("/api/copilot/quick-prompts");
  return response.data;
}
