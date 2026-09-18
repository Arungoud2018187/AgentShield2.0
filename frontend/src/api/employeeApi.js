import api from "./axios";

export async function getEmployeeDashboard() {
  const response = await api.get("/api/employee/dashboard");
  return response.data;
}
