const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://aashishofficial123_db_user:AV445S3k0brlHEPu@ac-791ijbv-shard-00-00.q0seg1w.mongodb.net:27017,ac-791ijbv-shard-00-01.q0seg1w.mongodb.net:27017,ac-791ijbv-shard-00-02.q0seg1w.mongodb.net:27017/meet?ssl=true&replicaSet=atlas-uhm015-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function check() {
    await mongoose.connect(MONGODB_URI);
    const Meeting = mongoose.model("Meeting", new mongoose.Schema({ title: String, owner: mongoose.Schema.Types.Mixed }));

    const meetings = await Meeting.find();
    meetings.forEach(m => {
        console.log(`MEETING: ${m.title} | OWNER: ${m.owner} | OWNER_TYPE: ${typeof m.owner}`);
    });

    process.exit(0);
}

check();
