const mongoose = require('mongoose');
const Review = require('./review');
// const User = require('./user');

const Schema = mongoose.Schema


const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.review
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);



