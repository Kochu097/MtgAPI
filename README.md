# MTG_API – Magic: The Gathering Ultimate API

![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-brightgreen)
![License](https://img.shields.io/badge/license-Proprietary-red)

---

## 📖 Overview
The **Magic: The Gathering Ultimate API** allows you to search and retrieve detailed information about Magic: The Gathering (MTG) cards.  
Fetch cards by name or explore full sets, complete with rarity, pricing, and high-quality images from Scryfall.

Perfect for collectors, traders, and MTG deck builders.

---

## ✅ Features
- 🔍 **Search cards by name** – get oracle text, rarity, pricing, and images.
- 📦 **Fetch all cards from a specific set** – great for collection management.
- ⚡ **Fast & reliable** – built with Spring Boot and backed by Scryfall data.
- 🖼 **High-quality card images** (normal, large, art-cropped).

---

## 🛠 Tech Stack
- **Java 17**
- **Spring Boot 3.5.3**
- **Maven**
- **Caffeine Cache** (for fast repeated requests)
- **Springdoc OpenAPI** (Swagger UI for easy testing)

---

## 🚀 Getting Started

### ✅ Prerequisites
- Java 17 or newer
- Maven 3.9+
- (Optional) Docker, if you want to run it in a container

### ✅ Installation

```bash
git clone https://github.com/your-username/mtg_api.git
cd mtg_api
./mvnw clean package
```

### ✅ Running Locally

```bash
./mvnw spring-boot:run
```

API will be available at:
```
http://localhost:8080
```

### ✅ Running with Docker (Optional)

```bash
docker build -t mtg-api .
docker run -p 8080:8080 mtg-api
```

---

## ⚙️ Configuration

The app supports multiple profiles:

| Profile | Description |
|---------|-------------|
| `dev`   | Default for local development. |
| `prod`  | Production-ready (used on Render deployment). |

Set active profile:
```bash
export SPRING_PROFILES_ACTIVE=prod
```

---

## 📌 Endpoints Overview

| Method | Endpoint          | Description                             |
|--------|-------------------|-----------------------------------------|
| GET    | `/getCardByName`  | Search for a card by name.              |
| GET    | `/getCardsBySet`  | Retrieve all cards from a specific set. |

### Example: Get Card by Name

```
GET /getCardByName?name=Lightning%20Bolt
```

Example response:

```json
{
  "name": "Lightning Bolt",
  "rarity": "uncommon",
  "prices": { "usd": "0.91", "eur": "1.40" },
  "set_name": "Ravnica: Clue Edition",
  "set": "clu",
  "collector_number": "141"
}
```

### Example: Get Cards by Set

```
GET /getCardsBySet?setcode=tla
```

Example response:

```json
[
  {
    "name": "Avatar Aang // Aang, Master of Elements",
    "rarity": "mythic",
    "set_name": "Avatar: The Last Airbender",
    "set": "tla",
    "collector_number": "363"
  }
]
```

---

## ❗ Error Handling

| Status | Meaning | Example Response |
|--------|---------|------------------|
| 400 | Invalid parameter | `{ "message": "Invalid set code", "status": 400 }` |
| 404 | Not Found | `{ "message": "Card not found under name: X", "status": 404 }` |
| 500 | Internal Error | `{ "message": "An unexpected error occurred", "status": 500 }` |

---

## 📄 License

### Proprietary License – All Rights Reserved

```
Copyright (c) 2025 Maciej Nowak-Kochman

This project is proprietary software. You may view and use the API via its public endpoints for personal or commercial purposes.  
Copying, modifying, or redistributing the source code is strictly prohibited without explicit permission from the author.
```

---

## 👤 Author
Created by **Kochu097**  
Feel free to reach out on GitHub if you have any questions or collaboration ideas.
