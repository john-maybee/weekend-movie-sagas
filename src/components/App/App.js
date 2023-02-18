import {HashRouter as Router, Route} from 'react-router-dom';
import './App.css';
import MovieList from '../MovieList/MovieList';
import Details from '../Details/Details';

function App() {
  return (
    <div className="App">
      <h1 className="moviesHeader">The Movies Saga!</h1>
      <Router>        
        <Route path="/" exact>
          <MovieList />
        </Route>
        
        {/* Details page */}
        <Route path="/details" exact>
          <Details />
        </Route>
        {/* Add Movie page */}
      </Router>
    </div>
  );
};  // end of App function where we utilize a Router from react-router-dom and Route to the paths that are triggered by the onClick events


export default App;
