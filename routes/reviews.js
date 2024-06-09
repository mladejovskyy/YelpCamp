const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/review.js");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Review = require("../models/review");
const Campground = require("../models/campground");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

router.post("/", validateReview, isLoggedIn, catchAsync(reviews.addReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
