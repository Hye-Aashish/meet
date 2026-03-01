const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://aashishofficial123_db_user:AV445S3k0brlHEPu@ac-791ijbv-shard-00-00.q0seg1w.mongodb.net:27017,ac-791ijbv-shard-00-01.q0seg1w.mongodb.net:27017,ac-791ijbv-shard-00-02.q0seg1w.mongodb.net:27017/meet?ssl=true&replicaSet=atlas-uhm015-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function promote() {
    await mongoose.connect(MONGODB_URI);
    const User = mongoose.model("User", new mongoose.Schema({ email: String, role: String, createdAt: String }));
    const users = await User.find().sort({ createdAt: 1 });
    if (users.length > 0) {
        const firstUser = users[0];
        firstUser.role = 'admin';
        await firstUser.save();
        console.log(`PROMOTED: ${firstUser.email} to admin`);
    } else {
        console.log("NO_USERS_TO_PROMOTE");
    }
    process.exit(0);
}

promote();
