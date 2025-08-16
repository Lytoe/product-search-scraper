const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(cors());

// Scrape eBay
async function scrapeEbay(query) {
    const url = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;
    try {
        const { data } = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        const $ = cheerio.load(data);
        let results = [];

        $(".s-item").each((_, el) => {
            const title = $(el).find(".s-item__title").text();
            const price = $(el).find(".s-item__price").text();
            const link = $(el).find(".s-item__link").attr("href");
            const image = $(el).find(".s-item__image-img").attr("src");

            if (title && price && link) {
                results.push({ source: "eBay", title, price, link, image });
            }
        });
        return results.slice(0, 5);
    } catch (err) {
        console.error("eBay scrape error:", err.message);
        return [];
    }
}

async function scrapeAmazon(query) {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
    try {
        const { data } = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
                "Accept-Language": "en-US,en;q=0.9",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Referer": "https://www.google.com/"
            }
        });

        const $ = cheerio.load(data);
        let results = [];

        $(".s-result-item").each((_, el) => {
            const title = $(el).find("h2 a span").text();
            const priceWhole = $(el).find(".a-price-whole").first().text();
            const priceFraction = $(el).find(".a-price-fraction").first().text();
            const price = priceWhole ? `$${priceWhole}${priceFraction}` : "N/A";
            const link = "https://www.amazon.com" + $(el).find("h2 a").attr("href");
            const image = $(el).find("img.s-image").attr("src");

            if (title && link) {
                results.push({ source: "Amazon", title, price, link, image });
            }
        });
        return results.slice(0, 5);
    } catch (err) {
        console.error("Amazon scrape error:", err.message);
        return [];
    }
}


// Combined route
app.get("/search", async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Missing search query" });

    console.log(`Searching for: ${query}`);

    const [ebayResults, amazonResults] = await Promise.all([
        scrapeEbay(query),
        scrapeAmazon(query)
    ]);

    const combinedResults = [...ebayResults, ...amazonResults];
    res.json(combinedResults);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
