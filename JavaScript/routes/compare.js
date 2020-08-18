const express = require("express");
const router = express.Router();

const Artist = require("../models/artist");



// INDEX shows artists avaliable for comparison and form to submit query
router.get("/", (req, res) => {
	// Get all artists from DB
	Artist.find({}, (err, allArtists) => {
		if(err){
			console.log(err);
		} else{
			res.render("compare/index", {artists: allArtists});
		}
	});
    
});



// SHOW - comparison between srtists
router.get("/show", (req, res) => {

    const artists = req.query.artist;
    
    Artist.find({_id:{$in:artists}}, (err, foundArtists) => {
        if(err || !foundArtists){
            res.redirect("back");
        } else {  
            res.render("compare/show", {artists: foundArtists});
        }     
    });
    
});


// SHOW - shows more info about one artist
// router.get("/:id", (req, res) => {



module.exports = router;
