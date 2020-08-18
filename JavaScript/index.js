const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();


const seedDB = require("./seedDB");

//Requiring routes
const indexRoutes = require("./routes/index");
const artistsRoutes = require("./routes/artists");
const compareRoutes = require("./routes/compare");

// mongoose.connect('mongodb://localhost:27017/db_name', {
  mongoose.connect('mongodb://localhost:27017/test_db', {

  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));


//Setting middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true}));


app.use("/", indexRoutes);
app.use("/artists", artistsRoutes);
app.use("/compare", compareRoutes);

app.use(express.static(__dirname + "/public"));

// seedDB();		//seed the databse

app.listen(3000, () => console.log("Listening"));



