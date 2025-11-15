import express from "express";
import { nanoid } from "nanoid";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const shares = {}; // in-memory store of share links

// Create Share Link
app.post("/share", (req, res) => {
  const { itemId, ttlHours = 48 } = req.body;

  if (!itemId) {
    return res.status(400).json({ error: "itemId is required" });
  }

  const shareId = nanoid(6);
  const expiresAt = new Date(Date.now() + ttlHours * 3600000);
  const shareUrl = `http://localhost:5001/s/${shareId}`;

  shares[shareId] = {
    itemId,
    expiresAt,
    revoked: false,
  };

  console.log("Created share:", shareId);

  res.json({
    shareId,
    shareUrl,
    expiresAt,
  });
});

// Retrieve Shared Item
app.get("/s/:shareId", (req, res) => {
  const shareId = req.params.shareId;
  const record = shares[shareId];

  if (!record) {
    return res.status(404).json({ error: "Not found" });
  }

  if (record.revoked || new Date() > new Date(record.expiresAt)) {
    return res.status(410).json({ error: "Expired or revoked" });
  }

  // Example fake shared object (you can customize this)
  res.json({
    itemId: record.itemId,
    name: "Example Shared Item",
    description: "This is a shared item preview for demo purposes.",
  });
});

app.listen(5001, () => {
  console.log("Sharing Microservice running on http://localhost:5001");
});
