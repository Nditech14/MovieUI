import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Card, CardImg } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [searchHistory, setSearchHistory] = useState([]);
    const [error, setError] = useState(null);

    const apiBaseUrl = 'https://localhost:7119';

    const searchMovie = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/Movie/search/${query}`);
            const { data } = response;

            if (data.succeeded) {
                setSearchResults(data.data ? [data.data] : []); // Wrap the single movie in an array
                setError(null);
            } else {
                setError(data.message || 'Error fetching search results. Please try again.');
            }
        } catch (error) {
            handleAxiosError(error, 'Error fetching search results. Please try again.');
        }
    };

    const getSearchHistory = async () => {
        try {
            const response = await axios.get(`${apiBaseUrl}/api/Movie/searchHistory`);
            const { data } = response;

            if (data.succeeded) {
                setSearchHistory(data.data || []);
                setError(null);
            } else {
                setError(data.message || 'Error fetching search history. Please try again.');
            }
        } catch (error) {
            handleAxiosError(error, 'Error fetching search history. Please try again.');
        }
    };

    const handleAxiosError = (error, defaultMessage) => {
        if (error.response) {
            console.error('Axios Response Error:', error.response.data);
            setError(`Server Error: ${error.response.data.message || defaultMessage}`);
        } else if (error.request) {
            console.error('Axios Request Error:', error.request);
            setError('Network Error: Unable to reach the server.');
        } else {
            console.error('Axios General Error:', error.message);
            setError('Error: Something went wrong. Please try again.');
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h1>Movie Search</h1>
            </div>
            <div className="search-container">
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter movie title"
                />
                <Button color="success" onClick={searchMovie}>
                    Search
                </Button>
            </div>

            <div className="movie-list">
                {searchResults.map((movie) => (
                    <Card key={movie.imdbID} onClick={() => setSelectedMovie(movie)} className="movie-card">
                        <CardImg top width="100%" src={movie.poster} alt={movie.title} />
                        <h2>{movie.title}</h2>
                        <p>{movie.plot}<Button color="primary" className="more-link">Click for more....</Button></p>
                    </Card>
                ))}
            </div>

            {selectedMovie && (
                <div className="selected-movie">
                    <h2>{selectedMovie.title}</h2>
                    <img src={selectedMovie.poster} alt={selectedMovie.title} />
                    {/* ... (remaining selected movie details) */}
                </div>
            )}

            <div className="search-history">
                <Button color="info" onClick={getSearchHistory} className="search-button">
                    Get Search History
                </Button>
                <ul>
                    {searchHistory.map((history, index) => (
                        <li key={index}>{history}</li>
                    ))}
                </ul>
            </div>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
}

export default App;
