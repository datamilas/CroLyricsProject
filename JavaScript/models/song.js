const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
	title: String,
	artist: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Artist"
		},
		name: String
	}
});

module.exports = mongoose.model("Songs", songSchema);