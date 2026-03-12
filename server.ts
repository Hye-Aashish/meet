import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import mongoose from "mongoose";
import dns from "dns";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Fix for MongoDB Atlas querySrv ECONNREFUSED issues in some Node.js versions
dns.setDefaultResultOrder('ipv4first');

async function createApp() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = process.env.PORT || 3000;
  const JWT_SECRET = process.env.JWT_SECRET || "default_nexus_secret_change_me_immediately";

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Vite needs this disabled in dev
  }));
  app.use(mongoSanitize());
  app.use(express.json({ limit: '10kb' })); // Body limit

  // Rate Limiting
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { error: "Too many requests, please try again later." }
  });

  app.use("/api/auth", authLimiter);

  // Initialize Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AI_KEY_NOT_SET");

  // In-memory chat store for AI context (Session based)
  const meetingContexts = new Map<string, string[]>();

  // ========== Database Setup (MongoDB) ==========
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://aashishofficial123_db_user:AV445S3k0brlHEPu@ac-791ijbv-shard-00-00.q0seg1w.mongodb.net:27017,ac-791ijbv-shard-00-01.q0seg1w.mongodb.net:27017,ac-791ijbv-shard-00-02.q0seg1w.mongodb.net:27017/meet?ssl=true&replicaSet=atlas-uhm015-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }

  // ========== Mongoose Schemas & Models ==========
  const meetingSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    owner: String,
    title: String,
    roomId: { type: String, unique: true },
    scheduledAt: String,
    duration: Number,
    maxParticipants: Number,
    status: { type: String, default: 'active' },
    createdAt: { type: String, default: () => new Date().toISOString() },
    participantCount: { type: Number, default: 0 },
    permissions: {
      allowMic: { type: Boolean, default: true },
      allowCamera: { type: Boolean, default: true },
      allowScreenShare: { type: Boolean, default: true },
      allowChat: { type: Boolean, default: true },
      allowHandRaise: { type: Boolean, default: true },
      participantsVisible: { type: Boolean, default: true }
    }
  });

  const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: 'user' },
    plan: { type: String, default: 'Free Bharat' },
    createdAt: { type: String, default: () => new Date().toISOString() }
  });

  const recordingSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    owner: String,
    title: String,
    roomId: String,
    duration: Number,
    size: Number,
    createdAt: { type: String, default: () => new Date().toISOString() }
  });

  const settingsSchema = new mongoose.Schema({
    key: { type: String, unique: true },
    owner: String,
    allowMic: { type: Boolean, default: true },
    allowCamera: { type: Boolean, default: true },
    allowScreenShare: { type: Boolean, default: true },
    allowChat: { type: Boolean, default: true },
    allowHandRaise: { type: Boolean, default: true },
    participantsVisible: { type: Boolean, default: true },
    aiApiKey: { type: String, default: "" }
  });


  const logSchema = new mongoose.Schema({
    event: String,
    type: String, // 'auth' | 'meeting' | 'recording' | 'system' | 'ai'
    message: String,
    userId: String,
    userName: String,
    createdAt: { type: String, default: () => new Date().toISOString() }
  });

  const User = mongoose.model("User", userSchema);
  const Meeting = mongoose.model("Meeting", meetingSchema);
  const Recording = mongoose.model("Recording", recordingSchema);
  const Settings = mongoose.model("Settings", settingsSchema);
  const Log = mongoose.model("Log", logSchema);

  // Helper function to create logs
  const createSystemLog = async (event: string, type: string, message: string, userId?: string, userName?: string) => {
    try {
      await Log.create({ event, type, message, userId, userName });
    } catch (e) {
      console.error("Failed to create log:", e);
    }
  };

  // ========== Auth Middleware ==========
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

    try {
      const verified = jwt.verify(token, JWT_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  };

  const isAdmin = async (req: any, res: any, next: any) => {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Admin privileges required." });
      }
      next();
    } catch (err: any) {
      res.status(500).json({ error: "Internal Auth Error" });
    }
  };

  app.get('/api/super/stats', authenticateToken, isAdmin, async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalMeetings = await Meeting.countDocuments();
      const activeMeetings = await Meeting.countDocuments({ status: 'active' });
      const totalRecordings = await Recording.countDocuments();

      const planDistribution = await User.aggregate([
        { $group: { _id: "$plan", count: { $sum: 1 } } }
      ]);

      const recentUsers = await User.find({}, '-password').sort({ createdAt: -1 }).limit(5);
      const recentMeetings = await Meeting.find({}).sort({ createdAt: -1 }).limit(5);
      const recentLogs = await Log.find({}).sort({ createdAt: -1 }).limit(10);

      const systemStats = {
        cpuLoad: `${(Math.random() * 15 + 10).toFixed(1)}%`,
        memoryUsage: `${(Math.random() * 2 + 4).toFixed(1)} GB`,
        latency: `${Math.floor(Math.random() * 30 + 15)}ms`,
        uptime: '99.99%',
        nodes: 42
      };

      res.json({
        totalUsers, totalMeetings, activeMeetings, totalRecordings,
        planDistribution, recentUsers, recentMeetings, recentLogs, systemStats
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get('/api/super/users', authenticateToken, isAdmin, async (req, res) => {
    try {
      const users = await User.find({}, '-password').sort({ createdAt: -1 });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.put('/api/super/users/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
      const { plan, role } = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, { plan, role }, { new: true });
      await createSystemLog('ADMIN_USER_UPDATE', 'system', `Admin updated user: ${user?.email}`, req.user.id);
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete('/api/super/users/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      await createSystemLog('ADMIN_USER_DELETE', 'system', `Admin deleted user: ${user?.email}`, req.user.id);
      res.json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  app.get('/api/super/logs', authenticateToken, isAdmin, async (req, res) => {
    try {
      const logs = await Log.find().sort({ createdAt: -1 }).limit(100);
      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  app.delete('/api/super/logs', authenticateToken, isAdmin, async (req, res) => {
    try {
      await Log.deleteMany({});
      await createSystemLog('ADMIN_CLEAR_LOGS', 'system', 'Admin cleared all logs', req.user.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to clear logs" });
    }
  });

  // ========== AI Routes ==========
  app.post('/api/ai/ask', async (req, res) => {
    try {
      const { roomId, question, context } = req.body;
      const apiKey = globalSettings.aiApiKey || process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "AI_KEY_NOT_SET") {
        return res.json({ answer: `[SIMULATION] Based on the context provided for Room ${roomId}, it seems the team is discussing key system parameters. Regarding your question "${question}", I recommend checking the logs.` });
      }

      const client = new GoogleGenerativeAI(apiKey);
      const model = client.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `

        You are Nexus AI, the intelligent assistant for the "Nexus Authority" meeting platform.
        You are helping the host/admin of a meeting.
        
        MEETING CONTEXT (Discussion so far):
        ${context || "No messages yet."}

        USER'S QUESTION:
        ${question}

        Answer the question based on the discussion above. Be professional, direct, and authoritative. 
        If the information is not in the context, say you don't know based on what was heard.
        Keep the answer concise (max 3-4 sentences).
      `;

      // Simulation if key not set
      if (process.env.GEMINI_API_KEY === "AI_KEY_NOT_SET" || !process.env.GEMINI_API_KEY) {
        return res.json({ answer: `[SIMULATION] Based on the context provided for Room ${roomId}, it seems the team is discussing key system parameters and deployment timelines. Regarding your question "${question}", I recommend reviewing the logs for specific event vectors.` });
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      await createSystemLog('AI_ASK', 'ai', `AI Query in room ${roomId}: ${question}`);
      res.json({ answer: text });
    } catch (err: any) {
      console.error("AI Error:", err.message);
      res.status(500).json({ error: "Neural core timeout" });
    }
  });

  app.post('/api/ai/summarize', async (req, res) => {
    try {
      const { roomId, context } = req.body;
      const apiKey = globalSettings.aiApiKey || process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "AI_KEY_NOT_SET") {
        return res.json({ summary: `[SIMULATION SUMMARY for ${roomId}]\n\n1. Overview: Discussion centered on system stabilization.\n2. Key Points: AI is active in simulation mode.\n3. Decisions: Deploying real API key via Super Admin panel.` });
      }

      const client = new GoogleGenerativeAI(apiKey);
      const model = client.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `

        You are Nexus AI. Summarize the following meeting discussion into a professional, bulleted summary.
        Mention key participants and decisions if found.
        
        DISCUSSION:
        ${context || "No discussion data found."}

        Format:
        1. Overview
        2. Key Points
        3. Decisions/Action Items
      `;

      if (process.env.GEMINI_API_KEY === "AI_KEY_NOT_SET" || !process.env.GEMINI_API_KEY) {
        return res.json({ summary: `[SIMULATION SUMMARY for ${roomId}]\n\n1. Overview: Discussion centered on system stabilization and super admin features.\n2. Key Points: Users have been migrated to the new schema; Logs are now dynamic.\n3. Decisions: Deploying Nexus AI as the primary meeting assistant.` });
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      await createSystemLog('AI_SUMMARY', 'ai', `Meeting summary generated for ${roomId}`);
      res.json({ summary: text });
    } catch (err: any) {
      res.status(500).json({ error: "Summary generation failed" });
    }
  });

  // ========== Auth Routes ==========
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const userCount = await User.countDocuments();
      const role = userCount === 0 ? 'admin' : 'user';
      const user = await User.create({ name, email, password: hashedPassword, role });

      await createSystemLog('USER_REGISTER', 'auth', `New user registered: ${name}`, user._id.toString(), name);

      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, plan: user.plan }
      });
    } catch (err) {
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid credentials" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

      await createSystemLog('USER_LOGIN', 'auth', `User logged in: ${user.name}`, user._id.toString(), user.name);

      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, plan: user.plan }
      });
    } catch (err) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // ========== Settings & Global Config ==========
  let globalSettings: any = {
    allowMic: true, allowCamera: true, allowScreenShare: true,
    allowChat: true, allowHandRaise: true, participantsVisible: true
  };

  const loadGlobalSettings = async () => {
    try {
      let settings = await Settings.findOne({ key: "global" });
      if (!settings) settings = await Settings.create({ key: "global" });
      const obj = settings.toObject();
      delete obj._id; delete obj.__v; delete obj.key;
      globalSettings = obj;
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
  };
  await loadGlobalSettings();

  app.get('/api/settings', authenticateToken, (req, res) => res.json(globalSettings));
  app.put('/api/settings', authenticateToken, isAdmin, async (req, res) => {
    try {
      const settings = await Settings.findOneAndUpdate({ key: "global" }, req.body, { new: true, upsert: true });
      const obj = settings.toObject();
      delete obj._id; delete obj.__v; delete obj.key;
      globalSettings = obj;
      await createSystemLog('SETTINGS_UPDATE', 'system', 'Global settings updated', req.user.id);
      res.json(globalSettings);
    } catch (err) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // ========== Meetings API ==========
  app.get('/api/meetings', authenticateToken, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    try {
      const userId = req.user.id;
      const meetings = await Meeting.find({ owner: userId }).sort({ createdAt: -1 });
      res.json(meetings);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch meetings" });
    }
  });

  app.get('/api/meetings/:id', authenticateToken, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    try {
      const userId = req.user.id;
      const meeting = await Meeting.findOne({ id: req.params.id, owner: userId });
      if (!meeting) return res.status(404).json({ error: 'Not found' });
      res.json(meeting);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post('/api/meetings', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { title, roomId, scheduledAt, duration, maxParticipants, status, permissions } = req.body;
      const meetingId = `mt_${Date.now()}`;
      const rId = roomId || Math.random().toString(36).substring(2, 10).toUpperCase();
      const created = await Meeting.create({
        id: meetingId, owner: userId, title: title || `Meeting ${rId}`, roomId: rId,
        scheduledAt, duration: duration || 60, maxParticipants: maxParticipants || 50,
        status: status || 'active', permissions: { ...globalSettings, ...(permissions || {}) }
      });
      await createSystemLog('MEETING_CREATE', 'meeting', `Meeting created: ${created.title}`, userId);
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: "Failed to create" });
    }
  });

  // ========== Socket.IO ==========
  const rooms: Map<string, Map<string, { id: string, name: string, isHost: boolean }>> = new Map();

  io.on("connection", (socket) => {
    let currentUser: { id: string; name: string; roomId: string; isHost: boolean } | null = null;

    socket.on("join", ({ roomId, name, userId }) => {
      const isFirstUser = !rooms.has(roomId) || rooms.get(roomId)!.size === 0;
      currentUser = { id: userId, name, roomId, isHost: isFirstUser };
      socket.join(roomId);
      if (!rooms.has(roomId)) rooms.set(roomId, new Map());
      rooms.get(roomId)!.set(socket.id, { id: userId, name, isHost: isFirstUser });
      socket.to(roomId).emit("user-joined", { userId, socketId: socket.id, name, participants: Array.from(rooms.get(roomId)!.values()) });
      socket.emit("room-state", { participants: Array.from(rooms.get(roomId)!.values()), isHost: isFirstUser });
    });

    socket.on("chat", (data) => {
      if (currentUser) {
        io.to(currentUser.roomId).emit("chat", { userId: currentUser.id, name: currentUser.name, text: data.text, timestamp: new Date().toISOString() });

        // Feed into AI context
        if (!meetingContexts.has(currentUser.roomId)) meetingContexts.set(currentUser.roomId, []);
        meetingContexts.get(currentUser.roomId)!.push(`${currentUser.name}: ${data.text}`);
        // Limit context size
        if (meetingContexts.get(currentUser.roomId)!.length > 100) meetingContexts.get(currentUser.roomId)!.shift();
      }
    });

    socket.on("disconnect", () => {
      if (currentUser) {
        const room = rooms.get(currentUser.roomId);
        if (room) {
          room.delete(socket.id);
          io.to(currentUser.roomId).emit("user-left", { userId: currentUser.id, socketId: socket.id });
          if (room.size === 0) rooms.delete(currentUser.roomId);
        }
      }
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return { app, server };
}

export { createApp, createApp as startServer };

if (process.argv[1] && (process.argv[1].endsWith('server.ts') || process.argv[1].endsWith('server.js'))) {
  createApp().then(({ server }) => {
    const PORT = parseInt(process.env.PORT || "3000", 10);
    server.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
  }).catch(err => console.error("❌ Failed to start server:", err));
}
