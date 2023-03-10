import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './MovieList.css'
import { useHistory } from 'react-router-dom';

function MovieList() {

    const dispatch = useDispatch();
    const movies = useSelector(store => store.movies);
    const history = useHistory();

    useEffect(() => {
        dispatch({ type: 'FETCH_MOVIES' });
    }, []);

    const handleClick = (movie) => {
        return (
            console.log(movie),
            dispatch({
                type: 'FETCH_GENRES',
                payload: movie.id
            }),
            dispatch({
                type: 'FETCH_MOVIE_DETAILS',
                payload: movie.id
            }),
            history.push('/details')
        )
    }
    return (
        <main className="mainPageBody">
            <h1>MovieList</h1>
            <p>(Click a poster to learn more!)</p>
            <section className="movies">
                {movies.map(movie => {
                    return (
                        <div key={movie.id} className="thisMovie">
                            <h3>{movie.title}</h3>
                            <img className="mainPageMovie" src={movie.poster} alt={movie.title} onClick={ () => {handleClick(movie)} } />
                        </div>
                    );
                })}
            </section>
        </main>

    );
}; // end of MovieList function. This displays/maps all of the movies in the database 
// this function also holds the handler for the click event that takes place when a poster is clicked. 
// this then routes you to the Details page utilizing the useHistory method.

export default MovieList;