const express = require("express");
const router = express.Router();

const Artist = require("../models/artist");



router.get("/", (req, res) => {
	// Get all artists from DB
	Artist.find({}, (err, allArtists) => {
		if(err){
			console.log(err);
		} else{
			res.render("landing", {artists: allArtists});
		}
	});
    
});

module.exports = router;

