# Sharing Microservice  

CS361 – Assignment 8 (Small Pool / Milestone #2)  
Author: Group 22

---

## Overview

The **Sharing Microservice** allows another program to create a **temporary share link** for an item and then retrieve that item using the generated URL.

### Communication Contract

This microservice runs independently on port **5001** and communicates using **HTTP JSON**.

Endpoints:

- `POST /share` – Create a share link for an item  
- `GET /s/{shareId}` – Retrieve the shared item using the share link  

The test program (`test_sharing_client.js`) demonstrates how a client program can request data from the microservice and receive a response.

---

## How to run the microservice

### Install dependencies

```
npm install
```

### Start the microservice

```
npm start
```

You should see:

```
Sharing Microservice running on http://localhost:5001
```

Leave this running in **Terminal #1**.

---

## 1. Creating a share link

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

## 2. Retrieving shared item

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

## Test program

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

## UML sequence diagram
```mermaid
---
config:
  theme: mc
---
sequenceDiagram
  participant Client
  participant Sharing Microservice
  participant Memory@{ "type" : "database"}

  Note right of Memory: Data Storage
  Note left of Client: Creating a share link
  Client ->> Sharing Microservice: Request to create a share link<br>POST /share { itemId, ttlHours }
  opt invalid itemID
    Sharing Microservice -->> Client: Error "itemId is required"
  end
  Sharing Microservice ->> Memory: Write information to Memory
  Sharing Microservice -->> Client: JSON reponse <br/>{ shareId, shareUrl, expiresAt }
  Note left of Client: Getting a share link <br/>When the user clicks the link
  Client ->> Sharing Microservice: User clicks on share link
  Sharing Microservice ->> Memory: send shareId
  Sharing Microservice -->> Client: JSON response <br/>{ itemId, name, description }
  alt link doesn't exist
    Sharing Microservice -->> Client: Status 404 Not found
  else link expired or removed
    Sharing Microservice -->> Client: Status 410 Expired or revoked
  end
