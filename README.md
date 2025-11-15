# Sharing Microservice  
CS361 – Assignment 8 (Small Pool / Milestone #2)  
Author: Group 22

---

## Overview

The **Sharing Microservice** allows another program to create a **temporary share link** for an item and then retrieve that item using the generated URL.

This microservice runs independently on port **5001** and communicates using **HTTP JSON**.

It supports:

- `POST /share` – Create a share link for an item  
- `GET /s/{shareId}` – Retrieve the shared item using the share link  

The test program (`test_sharing_client.js`) demonstrates how a client program can request data from the microservice and receive a response.

---

## How to Run the Microservice

### 1. Install dependencies
```
npm install
```

### 2. Start the microservice
```
npm start
```

You should see:
```
Sharing Microservice running on http://localhost:5001
```

Leave this running in **Terminal #1**.

---

# 1️⃣ Creating a Share Link

### **Endpoint**
```
POST http://localhost:5001/share
```

### **Headers**
```
Content-Type: application/json
```

### **Request Body Example**
```json
{
  "itemId": "abc123",
  "ttlHours": 48
}
```

### **Example Output**
```json
{
  "shareId": "sh_a1b2c3",
  "shareUrl": "http://localhost:5001/s/sh_a1b2c3",
  "expiresAt": "2025-11-20T18:00:00.000Z"
}
```

---

# 2️⃣ Retrieving Shared Item

### **Endpoint**
```
GET http://localhost:5001/s/{shareId}
```

### **Successful Response**
```json
{
  "itemId": "abc123",
  "name": "Example Shared Item",
  "description": "This is a sample shared item returned by the microservice."
}
```

### **Expired Response**
```
Status: 410 Gone
```

```json
{
  "error": "Expired"
}
```

---

# 🧪 Test Program

### `test_sharing_client.js`

```js
import axios from "axios";

async function run() {
  console.log("=== Creating a Share Link ===");

  const createResponse = await axios.post("http://localhost:5001/share", {
    itemId: "abc123",
    ttlHours: 48
  });

  console.log("Share Response:", createResponse.data);

  const shareUrl = createResponse.data.shareUrl;

  console.log("
=== Fetching Shared Item ===");

  const fetchResponse = await axios.get(shareUrl);
  console.log("Shared Item:", fetchResponse.data);
}

run();
```

Run:
```
node test_sharing_client.js
```

---

# 📈 UML Sequence Diagram

*(To be added)*