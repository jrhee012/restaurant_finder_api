if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    YELP_BASE_URL: 'https://api.yelp.com/v3',
    YELP_API_KEY: process.env.YELP_API_KEY,
    YELP_CLIENT_ID: process.env.YELP_CLIENT_ID,
    MONGODB_URI: process.env.MONGODB_URI,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
    TOKEN: process.env.TOKEN,
    REDIS_URL: process.env.REDIS_URL,
};
