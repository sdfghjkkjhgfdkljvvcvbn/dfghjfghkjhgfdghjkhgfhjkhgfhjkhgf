import express from "express";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy Supabase initialization
let supabase: SupabaseClient | null = null;

function getSupabase() {
  if (supabase) return supabase;
  
  // Try service role key first (for server-side full access), then fall back to anon key
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (supabaseUrl && supabaseKey) {
    console.log('✅ Initializing Supabase with SERVICE ROLE key...');
    supabase = createClient(supabaseUrl, supabaseKey);
    return supabase;
  }
  
  console.log('❌ Supabase SERVICE_ROLE_KEY not found');
  return null;
}

// Vercel serverless functions only allow writes under /tmp — everywhere else
// in the deployment bundle is read-only at runtime. Note that /tmp itself is
// ephemeral and not shared across instances, so admin edits and contact form
// submissions are not guaranteed to persist across cold starts or redeploys
// when running on Vercel; a real database is needed for durable storage.
const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "data")
  : path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const CONTACTS_FILE = path.join(DATA_DIR, "contacts.json");

// Read lazily (not cached at module load) since local dev loads .env via
// dotenv.config() in server.ts, which runs *after* this module is imported —
// ES module imports are evaluated before the importing file's own statements.
function getAdminUsername() {
  return process.env.ADMIN_USERNAME || "admin";
}
function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "parbati2026";
}
function getJwtSecret() {
  return process.env.JWT_SECRET || "parbati_interior_default_secret_key_2026";
}

const DEFAULT_PROJECTS = [
  {
    id: "1",
    title: "Luxury Living Room & Media Wall",
    description: "A stunning modern residential living room designed with customized LED backlighting, elegant marble-textured wooden paneling, and an integrated modular media center. Tailored for comfort and entertainment.",
    category: "Residential",
    mediaUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    mediaType: "image",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Modern Minimalist Modular Kitchen",
    description: "Space-efficient modular kitchen featuring high-gloss acrylic finishes, hydraulic soft-close fittings, intelligent pull-out organizers, and a custom quartz countertop designed for ultimate utility.",
    category: "Modular Kitchen",
    mediaUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    mediaType: "image",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Executive Corporate Workspace",
    description: "A state-of-the-art office workspace featuring customized acoustic glass partitions, ergonomic wood-metal collaborative desks, integrated power hubs, and elegant brand-accent corporate walls.",
    category: "Commercial",
    mediaUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    mediaType: "image",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "Cozy Master Bedroom with Custom Bed & Wardrobe",
    description: "An elegant master bedroom featuring warm WPC vertical wall claddings, a custom-designed platform bed with integrated side tables, soft ambient cove lighting, and a modern sliding walk-in wardrobe.",
    category: "Residential",
    mediaUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    mediaType: "image",
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "Custom Metal & Hardwood Lounge Set",
    description: "Bespoke furniture crafted in-house utilizing premium structural MS frames, powder-coated in modern matte black, and paired with premium teak hardwood inserts. Combines industrial durability with natural warmth.",
    category: "Custom Furniture",
    mediaUrl: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80",
    mediaType: "image",
    createdAt: new Date().toISOString()
  },
  {
    id: "6",
    title: "Premium Structural Villa & Exterior Cladding",
    description: "Complete general construction project of a luxury residential villa. Designed with structural concrete frames, durable terracotta brick exterior cladding, panoramic glass windows, and powder-coated architectural steel trims.",
    category: "General Construction",
    mediaUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    mediaType: "image",
    createdAt: new Date().toISOString()
  }
];

async function initDatabase() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    try {
      await fs.access(PROJECTS_FILE);
    } catch {
      await fs.writeFile(PROJECTS_FILE, JSON.stringify(DEFAULT_PROJECTS, null, 2), "utf-8");
      console.log("Database initialized with default seeded projects.");
    }

    try {
      await fs.access(CONTACTS_FILE);
    } catch {
      await fs.writeFile(CONTACTS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Error initializing local JSON database:", error);
  }
}

// Custom JWT-like lightweight token system using Node's crypto
function generateToken(username: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      username,
      exp: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
}

function verifyToken(token: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [header, payload, signature] = parts;
  const computedSignature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(`${header}.${payload}`)
    .digest("base64url");

  if (computedSignature !== signature) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    if (data.exp < Date.now()) {
      return false; // Token expired
    }
    return data.username === getAdminUsername();
  } catch {
    return false;
  }
}

function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  let token = "";

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    const customHeader = req.headers["x-admin-token"];
    if (typeof customHeader === "string") {
      token = customHeader;
    }
  }

  if (verifyToken(token)) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized access. Invalid credentials." });
  }
}

// Builds the Express app containing just the API routes (no static file
// serving or dev middleware) so it can be shared between the local dev
// server and the Vercel serverless function.
export function createApp() {
  const app = express();
  app.use(express.json());

  const dbReady = initDatabase();
  app.use(async (_req, _res, next) => {
    await dbReady;
    next();
  });

  // 1. PUBLIC: Fetch all projects
  app.get("/api/projects", async (req, res) => {
    try {
      // Try Supabase first
      const sb = getSupabase();
      if (sb) {
        const { data, error } = await sb
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.log('⚠️ Supabase error:', JSON.stringify(error, null, 2));
        }

        if (!error && data && data.length > 0) {
          console.log('✅ Fetched', data.length, 'projects from Supabase');
          // Transform Supabase projects to legacy format for compatibility
          const transformedProjects = data.map((proj: any) => ({
            id: proj.id,
            title: proj.title,
            description: proj.description,
            category: proj.category,
            mediaUrl: proj.media_url || '',
            mediaType: proj.media_type || 'image',
            createdAt: proj.created_at
          }));
          return res.json(transformedProjects);
        } else if (!error && (!data || data.length === 0)) {
          console.log('⚠️ Supabase connected but no projects found in database');
        }
      } else {
        console.log('⚠️ Supabase client not available');
      }

      // Fallback to JSON file
      console.log('📁 Falling back to JSON file');
      const fileContent = await fs.readFile(PROJECTS_FILE, "utf-8");
      const projects = JSON.parse(fileContent);
      res.json(projects);
    } catch (error) {
      console.error('❌ Error loading projects:', error);
      res.status(500).json({ error: "Failed to load projects." });
    }
  });

  // 2. PUBLIC: Save custom contact message
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, message } = req.body;
      if (!name || !email || !phone || !message) {
        return res.status(400).json({ error: "All contact fields are required." });
      }

      const fileContent = await fs.readFile(CONTACTS_FILE, "utf-8");
      const contacts = JSON.parse(fileContent);

      const newContact = {
        id: crypto.randomUUID(),
        name,
        email,
        phone,
        message,
        createdAt: new Date().toISOString()
      };

      contacts.unshift(newContact);
      await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2), "utf-8");

      res.json({ success: true, message: "Thank you! Your message has been saved successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to save contact request." });
    }
  });

  // 3. ADMIN LOGIN
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;

    if (username === getAdminUsername() && password === getAdminPassword()) {
      const token = generateToken(username);
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, error: "Invalid admin username or password." });
    }
  });

  // 4. ADMIN VERIFY
  app.get("/api/admin/verify", (req, res) => {
    const authHeader = req.headers.authorization;
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else {
      const customHeader = req.headers["x-admin-token"];
      if (typeof customHeader === "string") {
        token = customHeader;
      }
    }

    if (verifyToken(token)) {
      res.json({ valid: true });
    } else {
      res.status(401).json({ valid: false, error: "Token expired or invalid." });
    }
  });

  // 5. ADMIN ONLY: Fetch contact leads list
  app.get("/api/admin/contacts", authenticateAdmin, async (req, res) => {
    try {
      const fileContent = await fs.readFile(CONTACTS_FILE, "utf-8");
      const contacts = JSON.parse(fileContent);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to load contacts." });
    }
  });

  // 6. ADMIN ONLY: Delete contact lead
  app.delete("/api/admin/contacts/:id", authenticateAdmin, async (req, res) => {
    try {
      const fileContent = await fs.readFile(CONTACTS_FILE, "utf-8");
      const contacts = JSON.parse(fileContent);
      const updatedContacts = contacts.filter((c: any) => c.id !== req.params.id);
      await fs.writeFile(CONTACTS_FILE, JSON.stringify(updatedContacts, null, 2), "utf-8");
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact request." });
    }
  });

  // 7. ADMIN ONLY: Add new project
  app.post("/api/projects", authenticateAdmin, async (req, res) => {
    try {
      const { title, description, category, mediaUrl, mediaType } = req.body;
      if (!title || !description || !category || !mediaUrl || !mediaType) {
        return res.status(400).json({ error: "Missing required project fields." });
      }

      const fileContent = await fs.readFile(PROJECTS_FILE, "utf-8");
      const projects = JSON.parse(fileContent);

      const newProject = {
        id: crypto.randomUUID(),
        title,
        description,
        category,
        mediaUrl,
        mediaType,
        createdAt: new Date().toISOString()
      };

      projects.unshift(newProject);
      await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");

      res.json({ success: true, project: newProject });
    } catch (error) {
      res.status(500).json({ error: "Failed to add project." });
    }
  });

  // 8. ADMIN ONLY: Update a project
  app.put("/api/projects/:id", authenticateAdmin, async (req, res) => {
    try {
      const { title, description, category, mediaUrl, mediaType } = req.body;
      if (!title || !description || !category || !mediaUrl || !mediaType) {
        return res.status(400).json({ error: "Missing required fields for update." });
      }

      const fileContent = await fs.readFile(PROJECTS_FILE, "utf-8");
      const projects = JSON.parse(fileContent);

      const index = projects.findIndex((p: any) => p.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: "Project not found." });
      }

      projects[index] = {
        ...projects[index],
        title,
        description,
        category,
        mediaUrl,
        mediaType,
        updatedAt: new Date().toISOString()
      };

      await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), "utf-8");

      res.json({ success: true, project: projects[index] });
    } catch (error) {
      res.status(500).json({ error: "Failed to update project." });
    }
  });

  // 9. ADMIN ONLY: Delete a project
  app.delete("/api/projects/:id", authenticateAdmin, async (req, res) => {
    try {
      const fileContent = await fs.readFile(PROJECTS_FILE, "utf-8");
      const projects = JSON.parse(fileContent);

      const filteredProjects = projects.filter((p: any) => p.id !== req.params.id);
      await fs.writeFile(PROJECTS_FILE, JSON.stringify(filteredProjects, null, 2), "utf-8");

      res.json({ success: true, message: "Project deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project." });
    }
  });

  return app;
}
