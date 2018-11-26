const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const app = express();

// import users.js
const users = require("./routers/api/users");
const profile = require("./routers/api/profiles");

// DB config
const db = require("./config/keys").mongoURI;

// use body-parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Connect to mongodb
mongoose.connect(db).then(() => {
    console.log("MongoDB Conneted!");
}).catch(err => {
    console.log(err);
});

// passport initialize
app.use(passport.initialize());

require("./config/passport")(passport);


// use routers
app.use("/api/users", users);
app.use("/api/profiles", profile);

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})