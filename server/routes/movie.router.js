const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')

router.get('/', (req, res) => {

  const query = `SELECT * FROM "movies" ORDER BY "title" ASC`;
  pool.query(query)
    .then( result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log('ERROR: Get all movies', err);
      res.sendStatus(500)
    })

});

router.post('/', (req, res) => {
  console.log(req.body);
  // RETURNING "id" will give us back the id of the created movie
  const insertMovieQuery = `
  INSERT INTO "movies" ("title", "poster", "description")
  VALUES ($1, $2, $3)
  RETURNING "id";`

  // FIRST QUERY MAKES MOVIE
  pool.query(insertMovieQuery, [req.body.title, req.body.poster, req.body.description])
  .then(result => {
    console.log('New Movie Id:', result.rows[0].id); //ID IS HERE!
    
    const createdMovieId = result.rows[0].id

    // Now handle the genre reference
    const insertMovieGenreQuery = `
      INSERT INTO "movies_genres" ("movie_id", "genre_id")
      VALUES  ($1, $2);
      `
      // SECOND QUERY ADDS GENRE FOR THAT NEW MOVIE
      pool.query(insertMovieGenreQuery, [createdMovieId, req.body.genre_id]).then(result => {
        //Now that both are done, send back success!
        res.sendStatus(201);
      }).catch(err => {
        // catch for second query
        console.log(err);
        res.sendStatus(500)
      })

// Catch for first query
  }).catch(err => {
    console.log(err);
    res.sendStatus(500)
  })
});

router.get('/:id', (req, res) => {
  console.log('get movie id: ', req.params.id);
  const id = req.params.id;
  const query = `SELECT * FROM "movies" WHERE "id" = $1`;
  pool.query(query, [req.params.id])
    .then( result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log('ERROR: Get selected movie data', err);
      res.sendStatus(500)
    })
});

// need a router.get for the /:id in order to query a SELECT of the specific movie where the id  value = $1
// in order for us to fetch the selected movie details/other params


module.exports = router;

// To add a new movie you shouldn't need a new database for the post.
// Below is the router.post in Chris's example:
  // router.post('/', (req, res) => {
  //   console.log(req.body);
  //   // RETURNING "id" will give us back the id of the created movie
  //   const insertMovieQuery = `
  //   INSERT INTO "movies" ("title", "poster", "description")
  //   VALUES ($1, $2, $3)
  //   RETURNING "id";`

  //   // FIRST QUERY MAKES MOVIE
  //   pool.query(insertMovieQuery, [req.body.title, req.body.poster, req.body.description])
  //   .then(result => {
  //     console.log('New Movie Id:', result.rows[0].id); //ID IS HERE!
      
  //     const createdMovieId = result.rows[0].id
  //     res.sendStatus(201);
  //     // Now handle the genre reference
  //     // const insertMovieGenreQuery = `
  //     //   INSERT INTO "movies_genres" ("movie_id", "genre_id")
  //     //   VALUES  ($1, $2);
  //     //   `
  //     //   // SECOND QUERY ADDS GENRE FOR THAT NEW MOVIE
  //  this seems to be useful   //   pool.query(insertMovieGenreQuery, [createdMovieId, req.body.genre_id]).then(result => {
  //     //     //Now that both are done, send back success!
  //     //     res.sendStatus(201);
  //     //   }).catch(err => {
  //     //     // catch for second query
  //     //     console.log(err);
  //     //     res.sendStatus(500)
  //     //   })

  // // Catch for first query
  //   }).catch(err => {
  //     console.log(err);
  //     res.sendStatus(500)
  //   })
  // })