export async function apiCall(url, options = {}, loadingContainer) {
  if (loadingContainer) {
    loadingContainer.textContent = "Loading...";
  }
  try {
    const res = await fetch(url, { ...options, credentials: "include" });
    if (!res.ok) {
      const { message } = await res.json();
      throw new Error(message || "Request failed");
    }
    return await res.json();
  } catch (err) {
    throw err;
  } finally {
    if (loadingContainer) {
      loadingContainer.textContent = "";
    }
  }
}
