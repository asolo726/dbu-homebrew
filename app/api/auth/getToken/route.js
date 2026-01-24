export default async function getToken() {
  const id = process.env.AUTH0_CLIENT_ID;
  const secret = process.env.AUTH0_CLIENT_SECRET;
  const domain = process.env.AUTH0_DOMAIN;
  try {
    const response = await fetch(domain + "/oauth/token", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        client_id: id,
        client_secret: secret,
        audience: domain + "/api/v2/",
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error fetching token:", error);
  }
}
