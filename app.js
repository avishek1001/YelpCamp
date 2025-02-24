const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
//const joi = require('joi');

const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const campground = require('./models/campground');
const { campgroundSchema, reviewSchema } = require('./schemas');
const Review = require('./models/review');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// campground validating middleware

const validateCampground = (req, res, next) => {

    // const result = campgroundSchema.validate(req.body);
    // console.log(result);
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

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

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const titles = await Campground.find({});

    res.render('campgrounds/index', { titles });
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {

    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);

}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('review');
    // console.log(campground);
    res.render('campgrounds/show', { campground });
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    // res.send('edit page');
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);

    campground.review.push(review);
    await review.save();
    await campground.save();
    // console.log(campground);
    //res.send(req.body);
    res.redirect(`/campgrounds/${req.params.id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { message = "Something went wrong", statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render('campgrounds/error', { err });
})

app.listen('1234', () => {
    console.log('Listening from port 1234');
})