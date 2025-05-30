import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/room/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const url = `https://www.tiktok.com/@${username}/live`;
    const html = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0"
      }
    }).then(r => r.text());

    const jsonMatch = html.match(/<script id="__UNIVERSAL_DATA__" type="application\/json">(.*?)<\/script>/);
    if (!jsonMatch || jsonMatch.length < 2) {
      return res.status(404).json({ error: "No se encontró bloque de datos JSON" });
    }

    const json = JSON.parse(jsonMatch[1]);
    const roomId = json?.__DEFAULT_SCOPE__?.webcast?.roomInfo?.roomId;

    if (!roomId) {
      return res.status(404).json({ error: "No se encontró room_id para @" + username });
    }

    return res.json({ roomId });
  } catch (e) {
    res.status(500).json({ error: "Error al obtener roomId", details: e.message });
  }
});

app.listen(PORT, () => console.log("✅ API corriendo en puerto", PORT));
