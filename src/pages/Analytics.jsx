import React, { useEffect, useState } from "react";
import { fetchAnalytics } from "../api/analyticsApi";
import { useAuth } from "../contexts/AuthContext";

// Simple bar chart using plain divs (replace with Chart.js or Recharts for production)
function StatusBarChart({ data }) {
  const statuses = Object.keys(data);
  const max = Math.max(...Object.values(data), 1);
  return (
    <div style={{ display: "flex", gap: 16 }}>
      {statuses.map((status) => (
        <div key={status} style={{ textAlign: "center" }}>
          <div
            style={{
              height: `${(data[status] / max) * 120}px`,
              width: 40,
              background: "#1976d2",
              marginBottom: 8,
            }}
          ></div>
          <div>{status}</div>
          <div>{data[status]}</div>
        </div>
      ))}
    </div>
  );
}

const Analytics = () => {
  const { user } = useAuth();
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchAnalytics(user.uid)
      .then((data) => {
        setStatusCounts(data.statusCounts || {});
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch analytics");
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <div>Please log in to view analytics.</div>;
  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Task Status Analytics</h2>
      {Object.keys(statusCounts).length === 0 ? (
        <div>No analytics data available.</div>
      ) : (
        <StatusBarChart data={statusCounts} />
      )}
    </div>
  );
};

export default Analytics;
