import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Details = () => {
    const genres = useSelector(store => store.genres);
    const history = useHistory();

    return (
        <div>
            <main>
                <section className="genres">
                    {genres.map(genre => {
                        return (
                            <div className="movieGenres" >
                                <h3>{genre.genres}</h3>
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