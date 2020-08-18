const mongoose = require("mongoose");

const verbSchema = mongoose.Schema({
    word: String,
    repeats: Number,    
	// artist: {
	// 	id: {
	// 		type: mongoose.Schema.Types.ObjectId,
	// 		ref: "Artist"
	// 	},
	// 	name: String
	// }
});

module.exports = mongoose.model("Verb", verbSchema);

