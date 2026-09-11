import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { createApp } from "./server/createApp";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function start() {
  const app = createApp();

  if (process.env.NODE_ENV !== "production") {
    // Vite Dev Mode: inject middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode: serve compiled dist folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Parbati Interior Server successfully running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Critical error starting backend server:", err);
});
