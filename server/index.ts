import express, { type Request, Response, NextFunction } from "express";
import { connectToDatabase } from './db';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedCategories } from './seed-categories';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Connect to PostgreSQL database
  await connectToDatabase();
  
  // Seed categories if needed
  try {
    await seedCategories();
  } catch (error) {
    log(`Error seeding categories: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Simplify port handling to use a single port for Replit workflow
  // Try different ports if the default is in use
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5173;
  
  // Start the server and log any errors
  server.listen({
    port,
    host: "0.0.0.0",
  }, () => {
    log(`Server running on port ${port}`);
  }).on('error', (err: any) => {
    log(`Error starting server: ${err.message}`);
    process.exit(1); // Exit with error so Replit can restart the process
  });
})();
