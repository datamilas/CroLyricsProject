const express = require("express");
const router = express.Router();

const Artist = require("../models/artist");


// SHOW - shows more info about one artist
router.get("/:id", function(req, res){
	// find the artist with provided ID

	Artist.findById(req.params.id, function(err, foundArtist){
		if(err || !foundArtist){
			res.redirect("back");
		} else {
			// render show template with that artist
			res.render("artists/show", {artist: foundArtist});
		}
	});
});
module.exports = router;


