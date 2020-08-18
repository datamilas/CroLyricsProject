const mongoose = require("mongoose");

const artistSchema = new mongoose.Schema({
	name: String,
	image: String,
	nouns: [
		{
			word: String,
			repeats: Number
		}
	],
	verbs: [
		{
			word: String,
			repeats: Number
		}
	],
	adjectives: [
		{
			word: String,
			repeats: Number
		}
	],
	adverbs: [
		{
			word: String,
			repeats: Number
		}
	],
	pronouns: [
		{
			word: String,
			repeats: Number
		}
	]
});

module.exports = mongoose.model("Artist", artistSchema);
