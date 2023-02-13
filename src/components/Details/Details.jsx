import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Details = () => {
    const genres = useSelector(store => store.genres);
    const history = useHistory();

    return (
        <div>
            <main>
                <h1>Movie Details</h1>
                <section className="genres">
                    <h3>Genres</h3>
                    {genres.map(genre => {
                        return (
                            <div className="movieGenres" >
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