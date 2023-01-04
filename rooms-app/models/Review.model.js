const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const reviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User" },
    comment: { type: String, maxlength: 200 }
  });

const Review = model("Review", reviewSchema);

module.exports = Review;
