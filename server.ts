import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'content_store.json');

function ensureDataStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ posts: null, prompts: null, menus: null }, null, 2));
  }
}

function readDataStore() {
  try {
    ensureDataStore();
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading data store:', e);
    return { posts: null, prompts: null, menus: null };
  }
}

function writeDataStore(data: any) {
  try {
    ensureDataStore();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error writing data store:', e);
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Routes for Persistent Admin Content Storage
  app.get('/api/content', (req, res) => {
    const data = readDataStore();
    res.json(data);
  });

  app.post('/api/content', (req, res) => {
    const { posts, prompts, menus } = req.body;
    const current = readDataStore();
    const updated = {
      posts: posts !== undefined ? posts : current.posts,
      prompts: prompts !== undefined ? prompts : current.prompts,
      menus: menus !== undefined ? menus : current.menus,
      updatedAt: new Date().toISOString()
    };
    writeDataStore(updated);
    res.json({ success: true, count: updated.posts?.length || 0 });
  });

  app.get('/api/posts', (req, res) => {
    const data = readDataStore();
    res.json({ posts: data.posts || [] });
  });

  app.post('/api/posts', (req, res) => {
    const { posts } = req.body;
    if (!Array.isArray(posts)) {
      return res.status(400).json({ error: 'posts must be an array' });
    }
    const current = readDataStore();
    current.posts = posts;
    current.updatedAt = new Date().toISOString();
    writeDataStore(current);
    res.json({ success: true, count: posts.length });
  });

  app.get('/api/prompts', (req, res) => {
    const data = readDataStore();
    res.json({ prompts: data.prompts || [] });
  });

  app.post('/api/prompts', (req, res) => {
    const { prompts } = req.body;
    if (!Array.isArray(prompts)) {
      return res.status(400).json({ error: 'prompts must be an array' });
    }
    const current = readDataStore();
    current.prompts = prompts;
    current.updatedAt = new Date().toISOString();
    writeDataStore(current);
    res.json({ success: true, count: prompts.length });
  });

  app.get('/api/menus', (req, res) => {
    const data = readDataStore();
    res.json({ menus: data.menus || [] });
  });

  app.post('/api/menus', (req, res) => {
    const { menus } = req.body;
    if (!Array.isArray(menus)) {
      return res.status(400).json({ error: 'menus must be an array' });
    }
    const current = readDataStore();
    current.menus = menus;
    current.updatedAt = new Date().toISOString();
    writeDataStore(current);
    res.json({ success: true, count: menus.length });
  });

  // API Route: Enhance or generate prompt using Gemini API (if key available)
  app.post('/api/enhance-prompt', async (req, res) => {
    try {
      const { prompt, tool, goal, tone } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({
          error: 'GEMINI_API_KEY is not configured in environment secrets.',
          fallback: true
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are a world-class Prompt Engineer specializing in AI model instructions (ChatGPT, Claude, Midjourney, Suno, Stable Diffusion, DeepSeek, etc.).
Refine and enhance the provided prompt to maximize response quality, structure, clarity, and precision. Include parameter suggestions where relevant. Format response in JSON with "enhancedPrompt", "parameters", "explanation", and "tips".`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Target AI Tool: ${tool || 'ChatGPT/Claude'}
Goal: ${goal || 'General assistance'}
Desired Tone: ${tone || 'Professional & Concise'}
Raw Input Prompt:
${prompt}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (text) {
        try {
          const parsed = JSON.parse(text);
          return res.json(parsed);
        } catch (e) {
          return res.json({ enhancedPrompt: text });
        }
      } else {
        return res.status(500).json({ error: 'No output received from Gemini API' });
      }
    } catch (error: any) {
      console.error('Error enhancing prompt:', error);
      return res.status(500).json({ error: error.message || 'Failed to enhance prompt' });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Prompt & Tech Tips Blog server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
