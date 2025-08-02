// react/backend/server.js
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

/**
 * Troca o code do OAuth pelo access_token do usuário
 */
app.get("/api/auth/callback", async (req, res) => {
  const { code } = req.query;
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
  console.log("[BACKEND] Recebido code:", code);

  if (!code) {
    console.log("[BACKEND] Code ausente!");
    return res.status(400).json({ error: "Parâmetro 'code' ausente." });
  }

  const auth = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  try {
    console.log("[BACKEND] Fazendo requisição para /api/token com redirect_uri igual ao do app...");

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "http://127.0.0.1:5173/callback", // Tem que ser idêntico ao usado no login
      }),
    });

    const data = await response.json();
    console.log("[BACKEND] Resposta do Spotify /api/token:", data);

    if (data.access_token) {
      console.log("[BACKEND] access_token OK! Retornando para frontend.");
      res.json(data); // access_token, refresh_token, etc
    } else {
      console.log("[BACKEND] Falha ao obter token:", data);
      res.status(500).json({ error: "Falha ao obter token do usuário", details: data });
    }
  } catch (err) {
    console.log("[BACKEND] Erro na requisição:", err);
    res.status(500).json({ error: "Erro na requisição para o Spotify", details: err });
  }
});

app.listen(port, () => {
  console.log(`Backend do Spotify rodando em http://localhost:${port}/api/token`);
});
