const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;
const DB_FILE = "roasts.json";

app.use(express.json());
app.use(express.static("."));

function loadRoasts() {
  if (!fs.existsSync(DB_FILE)) return {};
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveRoasts(roasts) {
  fs.writeFileSync(DB_FILE, JSON.stringify(roasts, null, 2));
}

// Admin - create a roast
app.post("/create", (req, res) => {
  const { name, message } = req.body;
  const roasts = loadRoasts();
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  roasts[slug] = { name, message };
  saveRoasts(roasts);
  res.json({ link: `/${slug}` });
});

// Friend opens their link
app.get("/:slug", (req, res) => {
  const roasts = loadRoasts();
  const roast = roasts[req.params.slug];
  if (!roast) return res.send("No roast found!");
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"/>
      <title>Hey ${roast.name}!</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #1a1a2e;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          text-align: center;
          padding: 20px;
        }
        .box {
          background: #16213e;
          padding: 40px;
          border-radius: 16px;
          max-width: 500px;
          border: 2px solid #e94560;
        }
        h1 { color: #e94560; font-size: 2em; }
        p { font-size: 1.2em; line-height: 1.6; }
        .emoji { font-size: 3em; }
      </style>
    </head>
    <body>
      <div class="box">
        <div class="emoji">😂</div>
        <h1>Hey ${roast.name}!</h1>
        <p>${roast.message}</p>
        <br/>
        <small style="color:#888">You just got roasted 🔥</small>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});