import express from "express";
import { TikTokLiveConnection } from "tiktok-live-connector";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/room/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const connection = new TikTokLiveConnection(username, { requestPollingIntervalMs: 0 });

    connection.connect().then(() => {
      const roomId = connection?.roomId;
      if (roomId) {
        res.json({ roomId });
      } else {
        res.status(404).json({ error: "No se encontró roomId para @" + username });
      }
      connection.disconnect();
    }).catch(err => {
      res.status(500).json({ error: "Error al conectar", details: err.message });
    });
  } catch (e) {
    res.status(500).json({ error: "Error general", details: e.message });
  }
});

app.listen(PORT, () => console.log("✅ API de TikTok Live Connector corriendo en puerto", PORT));
