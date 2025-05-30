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

    const roomIdMatch = html.match(/room_id=(\d+)/);
    if (!roomIdMatch) {
      return res.status(404).json({ error: "No se encontró room_id para @" + username });
    }

    return res.json({ roomId: roomIdMatch[1] });
  } catch (e) {
    res.status(500).json({ error: "Error al obtener roomId", details: e.message });
  }
});

app.listen(PORT, () => console.log("✅ API corriendo en puerto", PORT));
