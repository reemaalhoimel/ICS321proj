const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB Atlas!"))
.catch((error) => console.error("Error connecting to MongoDB Atlas:", error));

module.exports = mongoose;
