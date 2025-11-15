import axios from "axios";

// Test client for the sharing service
async function run() {
  console.log("=== Creating share link ===");

  const shareResponse = await axios.post("http://localhost:5001/share", {
    itemId: "abc123",
    ttlHours: 48,
  });

  console.log("Share Response:", shareResponse.data);

  console.log("\n=== Fetching shared item ===");

  const itemResponse = await axios.get(shareResponse.data.shareUrl);
  console.log("Shared Item:", itemResponse.data);
}

run();
