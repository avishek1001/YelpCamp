const express = require('express');
const router = express.Router();

const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema} = require('../schemas');
const ExpressError = require('../utils/ExpressError');


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

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validateCampground, catchAsync(async (req, res, next) => {

    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);

}))

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('review');
    // console.log(campground);
    res.render('campgrounds/show', { campground });
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    // res.send('edit page');
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports = router;