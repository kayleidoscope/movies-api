require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const MOVIES = require('./movies-data.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    console.log('validate bearer token middleware')

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }

    next()
})

function handleGetMovies(req, res) {
    let response = MOVIES;

    if (req.query.genre) {
        response = response.filter(movie => {
            let rightMovie = movie.genre.toLowerCase().includes(req.query.genre.toLowerCase());
            return rightMovie;
        })
    }

    if (req.query.country) {
        response = response.filter(movie => {
            let rightMovie = movie.country.toLowerCase().includes(req.query.country.toLowerCase());
            return rightMovie;
        })
    }

    if (req.query.averageVote) {
        response = response.filter(movie => {
            let movieVote = movie.avg_vote;
            let chosenAvg = Number(req.query.averageVote);
            if (chosenAvg <= movieVote) {
                return movie;
            }
        })
    }

    res.json(response)
}

app.get('/movies', handleGetMovies)

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`)
})