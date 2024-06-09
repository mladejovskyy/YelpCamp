const express = require("express");
const router = express.Router();
const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require("../middleware.js");
const catchAsync = require("../utils/catchAsync");

const Campground = require("../models/campground");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    /*
      if (!req.body.campground)
      throw new ExpressError("Invalid campground data", 400);
      */

    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    console.log("USER ID =>", req.user._id);
    await campground.save();
    req.flash("success", "Successfully made a new campground!"); // make new flash on successful post request
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");

    if (!campground) {
      req.flash("error", "Cannot find that campground.");
      return res.redirect("/campgrounds ");
    }
    res.render("campgrounds/show", { campground, currentUser: req.user });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");

    res.redirect("/campgrounds");
  })
);

module.exports = router;
