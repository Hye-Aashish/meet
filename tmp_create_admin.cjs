const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb://aashishofficial123_db_user:AV445S3k0brlHEPu@ac-791ijbv-shard-00-00.q0seg1w.mongodb.net:27017,ac-791ijbv-shard-00-01.q0seg1w.mongodb.net:27017,ac-791ijbv-shard-00-02.q0seg1w.mongodb.net:27017/meet?ssl=true&replicaSet=atlas-uhm015-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function createAdmin() {
    await mongoose.connect(MONGODB_URI);
    const User = mongoose.model("User", new mongoose.Schema({ email: String, password: String, name: String, role: String, plan: String, createdAt: String }));

    const existing = await User.findOne({ email: 'admin@nexus.com' });
    if (existing) {
        await User.deleteOne({ email: 'admin@nexus.com' });
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
        name: "Root Admin",
        email: "admin@nexus.com",
        password: hashedPassword,
        role: "admin",
        plan: "Enterprise",
        createdAt: new Date().toISOString()
    });

    console.log("CREATED_SUPER_ADMIN: admin@nexus.com / admin123");
    process.exit(0);
}

createAdmin();
