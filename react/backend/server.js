require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch"); // node-fetch v2
const cors = require("cors");

const app = express();
app.use(cors());
const port = 3030;

app.get("/api/token", async (req, res) => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return res.status(500).json({ error: "Client ID/Secret não configurados." });
  }

  const auth = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    if (data.access_token) {
      res.json({ access_token: data.access_token, expires_in: data.expires_in });
    } else {
      res.status(500).json({ error: "Erro ao obter token", details: data });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao fazer requisição", details: err });
  }
});

app.listen(port, () => {
  console.log(`Backend do Spotify rodando em http://localhost:${port}/api/token`);
});
