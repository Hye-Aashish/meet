const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://aashishofficial123_db_user:AV445S3k0brlHEPu@ac-791ijbv-shard-00-00.q0seg1w.mongodb.net:27017,ac-791ijbv-shard-00-01.q0seg1w.mongodb.net:27017,ac-791ijbv-shard-00-02.q0seg1w.mongodb.net:27017/meet?ssl=true&replicaSet=atlas-uhm015-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function check() {
    await mongoose.connect(MONGODB_URI);
    const User = mongoose.model("User", new mongoose.Schema({ email: String, role: String }));
    const admins = await User.find({ role: 'admin' });
    console.log("=== ADMINS ===");
    admins.forEach(a => console.log(`ADMIN: ${a.email} (${a.role})`));
    const others = await User.find({ role: 'user' });
    console.log("=== OTHERS ===");
    others.forEach(o => console.log(`USER: ${o.email} (${o.role})`));
    process.exit(0);
}

check();
