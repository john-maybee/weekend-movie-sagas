const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')

// router.get('/', (req, res) => {
//   // Add query to get all genres
//   const query = `SELECT * FROM genres ORDER BY "name" ASC`;
//   pool.query(query)
//     .then( result => {
//       console.log(result.rows);
//       res.send(result.rows);
//     })
//     .catch(err => {
//       console.log('ERROR: Get all genres', err);
//       res.sendStatus(500)
//     })

// }); // end of router.get that sends a query that selects all genres from the DB
    // this router.get gets the genres on site load due to '/'
    // realizing that this router needs to directly get the :id of the selected movie:
    // so will comment out above and create new get below


router.get('/:id', (req,res) => {
  console.log(req.params.id); // log the id information that we are getting from the db
  const query = `SELECT "movies"."title", "genres"."name" AS "genres" FROM "movies"
    JOIN "movies_genres" ON "movies_genres"."movie_id" = "movies"."id"
    JOIN "genres" ON "genres"."id" = "movies_genres"."genre_id" WHERE "movies"."id" = $1;`;
  pool.query(query, [req.params.id])
    .then(result => {
      console.log(result);
      res.send(result.rows);
    }).catch(err => {
      console.log('Error with genre.router router.get: ', err);
      res.sendStatus(500)
    })
}); // end of router.get that sends a query to join the movies and genres tables through the movies_genres table where the id = $1
// this should send over all of the genre information for the specific movie as required on the Details Page
// now that the two tables are joined through the movies_genres table

// if you get to the stretch goals, then add a router.post right here

module.exports = router;



// ---------MORE NOTES----------
// Need to work on this file. 
// movie.router has a query set to get all of the movies/ppsters and provides a route to get '/' displays all of the movies
// [X] need to add to the router.get to send a query to get all of the genres from 
  // This is going to be similar to the movie.router, but the req.body.___ is going to be different
  // Next thought is to see where we are supposed to display the genres within the instructions.
  // rn it seems like the router is set to get the information on page load. Do we need to display them on the DOM here too?