const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://aashishofficial123_db_user:AV445S3k0brlHEPu@ac-791ijbv-shard-00-00.q0seg1w.mongodb.net:27017,ac-791ijbv-shard-00-01.q0seg1w.mongodb.net:27017,ac-791ijbv-shard-00-02.q0seg1w.mongodb.net:27017/meet?ssl=true&replicaSet=atlas-uhm015-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function audit() {
    await mongoose.connect(MONGODB_URI);
    const User = mongoose.model("User", new mongoose.Schema({ name: String, email: String }));
    const Meeting = mongoose.model("Meeting", new mongoose.Schema({ title: String, owner: String, roomId: String }));

    const users = await User.find();
    const meetings = await Meeting.find();

    console.log("--- USERS ---");
    users.forEach(u => console.log(`[${u._id}] ${u.name} (${u.email})`));

    console.log("\n--- MEETINGS ---");
    meetings.forEach(m => {
        const owner = users.find(u => u._id.toString() === m.owner);
        console.log(`- ${m.title} (Room: ${m.roomId}) | Owner ID: ${m.owner} | Owner Name: ${owner ? owner.name : 'UNKNOWN'}`);
    });

    process.exit(0);
}

audit();
