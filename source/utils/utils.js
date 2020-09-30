const axios = require("axios");
const getAuthToken = async (client, secret) => {
  //  a 64bit encoded "client_id:client_secret"
  const encoded = Buffer.from(client + ":" + secret).toString("base64");
  const authString = `Basic ${encoded}`;

  try {
    let raw = await axios({
      url: "https://accounts.spotify.com/api/token",
      method: "post",
      headers: {
        Authorization: authString,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: { grant_type: "client_credentials" },
    });
    let res = raw.data.access_token;
    return res;
  } catch (e) {
    console.error(e);
  }
};

module.exports = { getAuthToken };
