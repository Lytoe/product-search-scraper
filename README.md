Mini Product Metasearch (Amazon + eBay)

A tiny Google-like product search UI that queries a Node/Express backend which scrapes eBay (reliable) and Amazon (fragile, ToS-sensitive) and returns consolidated results.

⚠️ Legal/ToS: Scraping Amazon/eBay likely violates their Terms of Service. This project is for educational use only. Don’t deploy this against production sites or at scale.

Features

🔎 Single input, “Google-style” product search

🌐 Scrapes eBay and Amazon and merges results

🖼️ eBay image support (Amazon results may omit images)

🧩 Simple frontend (HTML/CSS/JS) + minimal backend (Express + Axios + Cheerio)

🛡️ CORS enabled for local development

Tech Stack

Frontend: Vanilla JS, HTML, CSS

Backend: Node.js, Express, Axios, Cheerio

Runtime: Node 18+ recommended

Folder Structure :
/frontend
  ├─ index.html
  ├─ index.js
  └─ style.css

/backend
  ├─ package.json
  ├─ package-lock.json
  └─ server.js

Quick Start
1) Backend
cd backend
npm install
npm start


Starts Express on http://localhost:3000

Endpoint: GET /search?q=<keyword>

2) Frontend

Option A — open directly:

Open frontend/index.html in your browser.

Option B — serve over HTTP (recommended):

# from project root (one-liners you can use)
npx http-server frontend -p 5173   # or
npx serve frontend -l 5173


If you serve the frontend on a different port, backend must stay accessible at http://localhost:3000 (CORS is enabled server-side).

API

GET /search?q=iphone

Response

[
  {
    "source": "eBay",
    "title": "Apple iPhone 13",
    "price": "$499.99",
    "link": "https://www.ebay.com/itm/...",
    "image": "https://i.ebayimg.com/images/..."
  },
  {
    "source": "Amazon",
    "title": "Apple iPhone 13",
    "price": "$509.00",
    "link": "https://www.amazon.com/dp/..."
  }
]


Notes:

Fields are best-effort parsed; availability depends on the site’s markup.

The backend currently returns up to ~5 items per source.