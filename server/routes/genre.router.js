const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')

router.get('/', (req, res) => {
  // Add query to get all genres
  res.sendStatus(500)
});

module.exports = router;

// Need to work on this file. 
// movie.router has a query set to get all of the movies/ppsters and provides a route to get '/' displays all of the movies
// [] need to add to the router.get to send a query to get all of the genres from 
  // This is going to be similar to the movie.router, but the req.body.___ is going to be different
  // Next thought is to see where we are supposed to display the genres within the instructions.
  // rn it seems like the router is set to get the information on page load. Do we need to display them on the DOM here too?