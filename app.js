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
const campgrounds = require('./routes/campgrounds');

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

app.use('/campgrounds', campgrounds);

app.get('/', (req, res) => {
    res.render('home');
})



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