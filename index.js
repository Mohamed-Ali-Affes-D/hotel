const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// ---- Firebase init (service-account.json from Firebase console) ----
admin.initializeApp({
  credential: admin.credential.cert(require("./service-account.json")),
  databaseURL: "https://YOUR-PROJECT.firebaseio.com",
});
const db = admin.database();

// ---- API: receptionist check-in ----
app.post("/checkin", async (req, res) => {
  const { roomId, guestName } = req.body;
  if (!roomId || !guestName)
    return res.status(400).json({ error: "missing fields" });

  try {
    await db.ref(`rooms/${roomId}`).set({
      guestName,
      timestamp: Date.now(),
    });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "db error" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
