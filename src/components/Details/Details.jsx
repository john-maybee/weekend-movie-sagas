import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Details = () => {
    const genres = useSelector(store => store.genres);
    const clickedMovie = useSelector(store => store.clickedMovie);
    const history = useHistory();

    return (
        <div>
            <main>
                <section classname="movieInformation">
                {clickedMovie.map(movie => {
                    return(
                    <div key={movie.id}>
                        <h1>{movie.title}</h1>
                        <img src={movie.poster} alt={movie.title} />
                        <h3>Description:</h3>
                        <p>{movie.description}</p>
                    </div>
                    )
                })}
                </section>
                <section className="genres">
                    <h3>Genres associated: </h3>
                        {genres.map(genre => {
                            return (
                                <div key={genre.id}>
                                    
                                    <li>{genre.genres}</li>
                                </div>
                            );
                        })}
                </section>
                <button className="home" onClick={() => {history.push('/')}}>Home</button>
            </main>
        </div>
    )
}

export default Details;