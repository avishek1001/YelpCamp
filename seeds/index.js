const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i <= 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus quos perspiciatis quibusdam quisquam voluptatum quaerat nulla suscipit magnam, pariatur atque perferendis laudantium laborum molestias molestiae doloribus sit sapiente iure tempora.',
            price
        })
        await camp.save()
    }
}

seedDb().then(() => {
    db.close();
})