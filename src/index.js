import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import { createStore, combineReducers, applyMiddleware } from 'redux';
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';

// Create the rootSaga generator function
function* rootSaga() {
    yield takeEvery('FETCH_MOVIES', fetchAllMovies);
    yield takeEvery('FETCH_GENRES', fetchGenres); // added a fetch for the genres. will add fetchAllGenres function.
    yield takeEvery('FETCH_MOVIE_DETAILS', fetchMovieDetails); // added a fetch for the details of the selected movie.
}

function* fetchAllMovies() {
    // get all movies from the DB
    try {
        const movies = yield axios.get('/api/movie');
        console.log('get all:', movies.data);
        yield put({ type: 'SET_MOVIES', payload: movies.data });

    } catch {
        console.log('get all error');
    }
        
}; // end of fetchAllMovies function

function* fetchGenres(action) {
    // get all genres from the DB
    console.log(' id payload of fetchGenres action ', action.payload);
    const id = action.payload;
    try {
        const genres = yield axios.get(`/api/genre/${id}`);
        // console.log('get all:', genres.data); Had it this way when I was originally creating this function with the intention on displaying all genres
        yield put({ type: 'SET_GENRES', payload: genres.data });

    } catch {
        console.log('fetchGenres error');
    }        
}; // end of fetchGenres function, which was previously called fetchAllGenres
// the reason this function isn't returning a console log on the home page is because there is no useEffect for the FETCH_GENRES at this point.
// will be able to use this SET_GENRES put if I decide to add a genres page where users can access movies by clicking on specific genres.
// could technically even access this through the individual movie pages if I make the genre fields clickable.
// the previous line isn't part of the base project requirements, but makes sense functionally for users.

function* fetchMovieDetails(action) {
    console.log('id of movie in payload: ', action.payload);
    const id = action.payload;
    try {
        const clickedMovie = yield axios.get(`/api/movie/${id}`);
        yield put({type: 'SET_MOVIE_DETAILS', payload: clickedMovie.data});
    } catch {
        console.log('error getting selected movie details');
    }
}

// todo: consider creating a reducer for the movies_genres in order to store this information returned from the server
// This means I will also need to create a a movies_genres router in order to access the information within the database.

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Used to store movies returned from the server
const movies = (state = [], action) => {
    switch (action.type) {
        case 'SET_MOVIES':
            return action.payload;
        default:
            return state;
    }
};

// Used to store the movie genres
const genres = (state = [], action) => {
    switch (action.type) {
        case 'SET_GENRES':
            return action.payload;
        default:
            return state;
    }
};

const clickedMovie = (state = [], action) => {
    // need to create the function* for this so that we create yield put type to get the movie information
    switch (action.type) {
        case 'SET_MOVIE_DETAILS':
            return action.payload;
        default:
            return state;
    }
};

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        movies,
        genres,
        clickedMovie,
    }),
    // Add sagaMiddleware to our store
    applyMiddleware(sagaMiddleware, logger),
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={storeInstance}>
        <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// Learned from Chris's video:
// Within the rootSaga function:
    // yield takeEvery('ADD_MOVIE', addMovie);
// Then made a generator function:
    // function* addMovie(action) {
    //     try {
    //         yield axios.post(`/api/movie`, action.payload);
    //         if (action.history) {
    //             // Redirect back to the movie list
    //             action.history.push('/');
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
// The fetchAllMovies generator function looks like:
    //function* fetchAllMovies() {
    // // get all movies from the DB
    //     try {
    //         const movies = yield axios.get('/api/movie');
    //         console.log('get all:', movies.data);
    //         yield put({ type: 'SET_MOVIES', payload: movies.data });

    //     } catch {
    //         console.log('get all error');
    //     }
            
    // }
// There is not an extra reducter for the post movie. This is just associated with the movies reducer.

// Below is his AddMovie.jsx component:
    // import { useDispatch, useSelector } from 'react-redux';
    // import { useParams } from 'react-router-dom';
    // import { useEffect, useState } from 'react';
    // import { useHistory } from 'react-router-dom';
    // import axios from 'axios';

    // function MovieDetail() {
    //     const genres = useSelector( store => store.genres );
    //     const [title, setTitle] = useState('');
    //     const [description, setDescription] = useState('');
    //     const [selectedOption, setSelectedOption] = useState('');
    //     const [poster, setPoster] = useState('');
    //     const dispatch = useDispatch();
    //     const history = useHistory();
    //     const { id } = useParams();

    //     useEffect(() => {
    //         if (id) { // Return false if id is undefined
    //             axios.get(`/api/movie/${id}`).then(response => {
    //                 const movie = response.data;
    //                 setTitle(movie.title);
    //                 setDescription(movie.description);
    //                 setPoster(movie.poster);
    //             }).catch(error => {
    //                 console.log(error);
    //                 alert('Something went wrong!');
    //             })
    //         } // else do nothing
    //     }, [id]);

    //     const submitForm = (e) => {
    //         e.preventDefault();
    //         if (id) {
    //             // EDIT AN EXISTING MOVIE
    //             dispatch({ type: 'EDIT_MOVIE', payload: { title, description, poster, id }, history });
    //         } else {
    //             // ADD A MOVIE
    //             // Pass history with our dispatch so that the saga can redirect
    //             dispatch({ type: 'ADD_MOVIE', payload: { title, description, poster }, history });
    //         }

    //     }

    //     const getTitle = () => {
    //         if (id) {
    //             return 'Edit Movie';
    //         } else {
    //             return 'Add Movie';
    //         }
    //     }

    //     return (
    //         <div>
    //             {/* <h1>{getTitle()}</h1> */}
    //             {id ? <h1>Edit Movie</h1> : <h1>Add Movie</h1> }
    //             <h3>{id}</h3>
    //             <form onSubmit={submitForm}>
    //                 <p>Title: <input value={title} onChange={(e) => setTitle(e.target.value)} /></p>
    //                 <p>Description: <input value={description} onChange={(e) => setDescription(e.target.value)}  /></p>
    //                 <p>Poster: <input value={poster} onChange={(e) => setPoster(e.target.value)}  /></p>
    //                 {/* <select
    //                     value={selectedOption}
    //                     onChange={e => setSelectedOption(e.target.value)}>
    //                     {genres.map(o => (
    //                         <option key={o.id} value={o.id}>{o.name}</option>
    //                     ))}
    //                 </select> */}
    //                 <input type="submit" />
    //             </form>
    //         </div>
    //     )
    // }

    // export default MovieDetail;
