const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://aashishofficial123_db_user:AV445S3k0brlHEPu@ac-791ijbv-shard-00-00.q0seg1w.mongodb.net:27017,ac-791ijbv-shard-00-01.q0seg1w.mongodb.net:27017,ac-791ijbv-shard-00-02.q0seg1w.mongodb.net:27017/meet?ssl=true&replicaSet=atlas-uhm015-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function check() {
    await mongoose.connect(MONGODB_URI);
    const User = mongoose.model("User", new mongoose.Schema({ email: String, role: String }));
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
        console.log(`FOUND_ADMIN: ${admin.email}`);
    } else {
        console.log("NO_ADMIN_FOUND");
    }
    process.exit(0);
}

check();
