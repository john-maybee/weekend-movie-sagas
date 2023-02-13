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

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        movies,
        genres,
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
