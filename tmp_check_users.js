const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nexus_portal");

        const User = mongoose.model("User", new mongoose.Schema({
            email: String,
            role: String,
            name: String
        }));

        const users = await User.find();
        console.log("USERS_JSON_START");
        console.log(JSON.stringify(users));
        console.log("USERS_JSON_END");

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
