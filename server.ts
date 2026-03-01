import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import mongoose from "mongoose";
import dns from "dns";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Fix for MongoDB Atlas querySrv ECONNREFUSED issues in some Node.js versions
dns.setDefaultResultOrder('ipv4first');

async function startServer() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = process.env.PORT || 3000;
  app.use(express.json());

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

  // Mongoose Schemas
  const meetingSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    owner: String, // User ID who owns this meeting
    title: String,
    roomId: { type: String, unique: true },
    scheduledAt: String,
    duration: Number,
    maxParticipants: Number,
    status: String,
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

  const User = mongoose.model("User", new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() }
  }));

  const recordingSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    owner: String, // User ID who owns this recording
    title: String,
    roomId: String,
    duration: Number,
    size: Number,
    createdAt: { type: String, default: () => new Date().toISOString() }
  });

  const settingsSchema = new mongoose.Schema({
    key: { type: String, unique: true }, // Can be "global" or UserID
    owner: String,
    allowMic: { type: Boolean, default: true },
    allowCamera: { type: Boolean, default: true },
    allowScreenShare: { type: Boolean, default: true },
    allowChat: { type: Boolean, default: true },
    allowHandRaise: { type: Boolean, default: true },
    participantsVisible: { type: Boolean, default: true }
  });

  const Meeting = mongoose.model("Meeting", meetingSchema);
  const Recording = mongoose.model("Recording", recordingSchema);
  const Settings = mongoose.model("Settings", settingsSchema);

  // ========== Auth Routes ==========
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: "User already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashedPassword });
      res.status(201).json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
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

      res.json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Global settings state
  let globalSettings: any = {
    allowMic: true,
    allowCamera: true,
    allowScreenShare: true,
    allowChat: true,
    allowHandRaise: true,
    participantsVisible: true
  };

  const loadGlobalSettings = async () => {
    try {
      let settings = await Settings.findOne({ key: "global" });
      if (!settings) {
        settings = await Settings.create({ key: "global" });
      }
      const obj = settings.toObject();
      delete obj._id; delete obj.__v; delete obj.key;
      globalSettings = obj;
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
  };

  await loadGlobalSettings();

  // ========== Settings API ==========
  app.get('/api/settings', (req, res) => {
    res.json(globalSettings);
  });

  app.put('/api/settings', async (req, res) => {
    try {
      const settings = await Settings.findOneAndUpdate(
        { key: "global" },
        req.body,
        { new: true, upsert: true }
      );
      const obj = settings.toObject();
      delete obj._id; delete obj.__v; delete obj.key;
      globalSettings = obj;
      res.json(globalSettings);
    } catch (err) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // ========== REST API Routes ==========

  // GET all meetings (USER SPECIFIC)
  app.get('/api/meetings', async (req, res) => {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const meetings = await Meeting.find({ owner: userId }).sort({ createdAt: -1 });
      res.json(meetings);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch meetings" });
    }
  });

  // GET single meeting
  app.get('/api/meetings/:id', async (req, res) => {
    try {
      const meeting = await Meeting.findOne({ id: req.params.id });
      if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
      res.json(meeting);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // GET meeting by roomId
  app.get('/api/meetings/room/:roomId', async (req, res) => {
    try {
      const meeting = await Meeting.findOne({ roomId: req.params.roomId });
      if (!meeting) {
        return res.json({ permissions: globalSettings });
      }
      res.json(meeting);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // CREATE meeting (USER SPECIFIC)
  app.post('/api/meetings', async (req, res) => {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const { title, roomId, scheduledAt, duration, maxParticipants, status, permissions } = req.body;
      const meetingId = `mt_${Date.now()}`;
      const rId = roomId || Math.random().toString(36).substring(2, 10).toUpperCase();
      const finalPermissions = { ...globalSettings, ...(permissions || {}) };

      const created = await Meeting.create({
        id: meetingId,
        owner: userId,
        title: title || `Meeting ${rId}`,
        roomId: rId,
        scheduledAt: scheduledAt || null,
        duration: duration || 60,
        maxParticipants: maxParticipants || 50,
        status: status || 'active',
        permissions: finalPermissions
      });

      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: "Failed to create meeting" });
    }
  });

  // UPDATE meeting
  app.put('/api/meetings/:id', async (req, res) => {
    try {
      const { title, scheduledAt, duration, maxParticipants, status, permissions } = req.body;
      const meeting = await Meeting.findOne({ id: req.params.id });
      if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

      if (title !== undefined) meeting.title = title;
      if (scheduledAt !== undefined) meeting.scheduledAt = scheduledAt;
      if (duration !== undefined) meeting.duration = duration;
      if (maxParticipants !== undefined) meeting.maxParticipants = maxParticipants;
      if (status !== undefined) meeting.status = status;
      if (permissions) {
        meeting.permissions = { ...meeting.permissions, ...permissions };
      }

      await meeting.save();
      res.json(meeting);
    } catch (err) {
      res.status(500).json({ error: "Failed to update meeting" });
    }
  });

  // DELETE meeting
  app.delete('/api/meetings/:id', async (req, res) => {
    try {
      await Meeting.deleteOne({ id: req.params.id });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete meeting" });
    }
  });

  // ========== Recordings API (USER SPECIFIC) ==========
  app.get('/api/recordings', async (req, res) => {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const recordings = await Recording.find({ owner: userId }).sort({ createdAt: -1 });
      res.json(recordings);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch recordings" });
    }
  });

  app.post('/api/recordings', async (req, res) => {
    try {
      const userId = req.headers['x-user-id'];
      // If no userId, it might be an anonymous recording (fallback to roomId or system)
      const { title, roomId, duration, size } = req.body;
      const recordingId = `rec_${Date.now()}`;
      const created = await Recording.create({
        id: recordingId,
        owner: userId || 'system',
        title: title || `Recording ${roomId}`,
        roomId: roomId || '',
        duration: duration || 0,
        size: size || 0
      });
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: "Failed to create recording" });
    }
  });

  app.delete('/api/recordings/:id', async (req, res) => {
    try {
      await Recording.deleteOne({ id: req.params.id });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete recording" });
    }
  });

  // ========== Socket.IO ==========
  // Store meeting state
  // rooms: { [roomId: string]: Map<socketId, { id: string, name: string, isHost: boolean }> }
  const rooms: Map<string, Map<string, { id: string, name: string, isHost: boolean }>> = new Map();

  io.on("connection", (socket) => {
    let currentUser: { id: string; name: string; roomId: string; isHost: boolean } | null = null;

    socket.on("join", ({ roomId, name, userId }) => {
      const isFirstUser = !rooms.has(roomId) || rooms.get(roomId)!.size === 0;
      currentUser = { id: userId, name, roomId, isHost: isFirstUser };
      socket.join(roomId);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map());
      }

      const room = rooms.get(roomId)!;
      // Use socket.id instead of userId to correctly handle multi-tab testing
      room.set(socket.id, { id: userId, name, isHost: isFirstUser });

      console.log(`📡 User ${name} (${userId}) joined room ${roomId} (Socket: ${socket.id}, Host: ${isFirstUser})`);

      // Notify others in the room
      socket.to(roomId).emit("user-joined", {
        userId,
        socketId: socket.id,
        name,
        participants: Array.from(room.values())
      });

      // Send current participants to the new user
      socket.emit("room-state", {
        participants: Array.from(room.values()),
        isHost: isFirstUser
      });
    });

    socket.on("chat", (data) => {
      if (currentUser) {
        io.to(currentUser.roomId).emit("chat", {
          userId: currentUser.id,
          name: currentUser.name,
          text: data.text,
          timestamp: new Date().toISOString()
        });
      }
    });

    socket.on("signal", (data) => {
      if (currentUser) {
        socket.to(data.targetId).emit("signal", {
          senderId: currentUser.id,
          signal: data.signal
        });
      }
    });

    socket.on("raise-hand", (data) => {
      if (currentUser) {
        io.to(currentUser.roomId).emit("raise-hand", {
          userId: currentUser.id,
          raised: data.raised
        });
      }
    });

    socket.on("toggle-media", (data) => {
      if (currentUser) {
        io.to(currentUser.roomId).emit("toggle-media", {
          userId: currentUser.id,
          mediaType: data.mediaType,
          enabled: data.enabled
        });
      }
    });

    socket.on("kick-user", ({ targetId }) => {
      if (currentUser?.isHost) {
        io.to(currentUser.roomId).emit("kick-user", { targetId });
      }
    });

    socket.on("mute-user", ({ targetId }) => {
      if (currentUser?.isHost) {
        io.to(currentUser.roomId).emit("mute-user", { targetId });
      }
    });

    socket.on("end-meeting", () => {
      if (currentUser?.isHost) {
        io.to(currentUser.roomId).emit("end-meeting");
      }
    });

    socket.on("request-screenshot", ({ targetId }) => {
      if (currentUser?.isHost) {
        console.log(`[Monitoring] Host ${currentUser.id} requesting screen from ${targetId}`);
        // Send specifically to the target socket if targetId is an ID
        // Note: For robustness, we still emit to the room but we could target the specific socket
        io.to(currentUser.roomId).emit("capture-screen-request", {
          requesterId: currentUser.id,
          targetId,
        });
      }
    });

    socket.on("request-screenshot-all", (data) => {
      if (currentUser?.isHost) {
        // console.log(`[Monitoring] Host ${currentUser.id} broadcasting screen request`);
        socket.to(currentUser.roomId).emit("capture-screen-request", {
          requesterId: data?.requesterId || socket.id,
          broadcast: true,
        });
      }
    });

    socket.on("screenshot-data", ({ targetId, screenshot }) => {
      // Participant sends screenshot back — forward to the requesting host
      if (currentUser) {
        console.log(`[Monitoring] Received screenshot data from ${currentUser.name} (${currentUser.id})`);
        io.to(currentUser.roomId).emit("screenshot-response", {
          userId: currentUser.id,
          userName: currentUser.name,
          screenshot,
        });
      }
    });

    socket.on("disconnect", () => {
      if (currentUser) {
        const room = rooms.get(currentUser.roomId);
        if (room) {
          room.delete(socket.id);
          io.to(currentUser.roomId).emit("user-left", {
            userId: currentUser.id,
            socketId: socket.id
          });

          if (room.size === 0) {
            rooms.delete(currentUser.roomId);
          }
        }
      }
    });
  });

  // ... socket logic ends ...

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // The wildcard catch-all should be handled AFTER all other routes
    // But Vercel's SPA routing might handle this instead.
    // However, keeping for standalone builds.
    app.get("*", (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return { app, server };
}

export { startServer as createApp };

// If run directly (not imported)
if (process.argv[1] && (process.argv[1].endsWith('server.ts') || process.argv[1].endsWith('server.js'))) {
  startServer().then(({ server }) => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }).catch(err => console.error("❌ Failed to start server:", err));
}
