const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../middleware');

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



router.get('/', catchAsync(async (req, res) => {
    const titles = await Campground.find({});

    res.render('campgrounds/index', { titles });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {


    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'playground successfully added');
    res.redirect(`/campgrounds/${newCampground._id}`);

}))

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('review').populate('author');
    // console.log(campground);
    res.render('campgrounds/show', { campground });
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    // res.send('edit page');
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Not Authorised');
        return res.redirect(`/campgrounds/${id}`);
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Not Authorised');
        return res.redirect(`/campgrounds/${id}`);
    }
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully Updated');
    // await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'Not Authorised');
        return res.redirect(`/campgrounds/${id}`);
    }
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports = router;