const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const movieRouter = require('./routes/movie.router.js');
const genreRouter = require('./routes/genre.router.js');
const port = process.env.PORT || 5001;

/** ---------- MIDDLEWARE ---------- **/
app.use(bodyParser.json()); // needed for angular requests
app.use(express.static('build'));

/** ---------- ROUTES ---------- **/
app.use('/api/movie', movieRouter);
app.use('/api/genre', genreRouter);
// do we need to add an app.use here for the movies_genres table and add a route as well?
// also, is the '/api' necessary to utilize? We haven't listed that w/in routes before.

/** ---------- START SERVER ---------- **/
app.listen(port, function () {
    console.log('Listening on port: ', port);
});
