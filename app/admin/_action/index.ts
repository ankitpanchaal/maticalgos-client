export const fetchApiKey = async () => {
  const response = await fetch("/api/admin/check-api-key", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch API key status");
  }
  return data;
};

export const testApiKey = async (apiKey: string) => {
  const response = await fetch("/api/admin/test-api-key", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
    },
    body: JSON.stringify({ apiKey }),
  });
  const data = await response.json();
  if (!response.ok) {
    //@ts-ignore
    throw new Error(data?.message || "Failed to test API key");
  }
  return data;
};

export const submitApiKey = async (apiKey: string) => {
  const response = await fetch("/api/admin/submit-api-key", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
    },
    body: JSON.stringify({ apiKey }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to submit API key");
  }
  return data;
};
