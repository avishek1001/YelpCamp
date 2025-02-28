const express = require('express');
const router = express.Router();

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { reviewSchema } = require('../schemas');
const Campground = require('../models/campground');
const Review = require('../models/review');

const validateReview = (req, res, next) => {

    // const result = reviewSchema.validate(req.body);
    // console.log(result);
    const { error } = reviewSchema.validate(req.body);
    //console.log(error);

    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);

    campground.review.push(review);
    await review.save();
    await campground.save();
    // console.log(campground);
    //res.send(req.body);
    res.redirect(`/campgrounds/${req.params.id}`);
}))

router.delete('/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;