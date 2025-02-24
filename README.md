# YelpCamp

YelpCamp is a full-stack web application inspired by Yelp, but specifically designed for campgrounds. It allows users to explore, review, and share their favorite camping spots. This project is built using Node.js, Express, MongoDB, and other modern web technologies.

## Features

- **User Authentication**: Users can sign up, log in, and log out. Passwords are securely hashed using bcrypt.
- **Campground Listings**: Users can browse a list of campgrounds with details such as name, image, location, and description.
- **Reviews**: Users can leave reviews and ratings for campgrounds.
- **CRUD Operations**: Users can create, read, update, and delete campgrounds and reviews.
- **Interactive Map**: Each campground is displayed on a map using Mapbox.
- **Responsive Design**: The application is fully responsive and works on all devices.

## Technologies Used

- **Frontend**: HTML, CSS, Bootstrap, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB (with Mongoose for schema modeling)
- **Authentication**: Passport.js
- **Maps**: Mapbox
- **Deployment**: Heroku, MongoDB Atlas

## Installation

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/avishek1001/YelpCamp.git
   cd YelpCamp

2. **Install dependencies**:
   ```bash
   npm install

4. **Set up environment variables**:
Create a .env file in the root directory and add the following variables:

   ```
   DATABASE_URL=mongodb://localhost:27017/yelpcamp
   MAPBOX_TOKEN=your_mapbox_token_here
   SECRET=your_secret_key_here

4. **Run Application**:
   ```bash
   npm start
