const mongoose = require("mongoose");

// A package used to get global variable from config
const config = require("config");
//Get connection variable from default.json
const db = config.get("mongoURI");

const connectDB = async () => {
    try {

        const option = {
             useNewUrlParser: true,
             useUnifiedTopology: true,
             useCreateIndex: true
             };
        //This returns a promise, hence we await
        await mongoose.connect(db, option);

        console.log("MongoDB connected...");
    } catch (err) {
        console.error(err.message);
        //Exit process with failure
        process.exit(1);
    }
};


module.exports = connectDB;