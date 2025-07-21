// wherever you fetch analytics
import axiosClient from "./axiosClient";

export async function fetchAnalytics(userId, projectId = null) {
  // No need for the full URL here—just use the path
  const params = { userId };
  if (projectId) {
    params.projectId = projectId;
  }
  const response = await axiosClient.get("/analytics", {
    params,
  });
  return response.data;
}
