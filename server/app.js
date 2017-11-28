const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

const YoutubeAPI= require('./YoutubeAPI');
const youtube = new YoutubeAPI();



const Datab = require('./ClassDatab');
const db = new Datab();


// Setup del server minimale, andrà ampliato per una maggiore robustezza

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('/api/:id', (req, res) => {
    switch (req.params.id) {
        case 'youtube':
            var searchString = req.query.search;
            if(searchString) {
                youtube.find(searchString, (result) => {
                    res.send(result);
                });
                return;
            }
    }
    res.status(404).send('Comando non riconsciuto');
});

//richiamo db-server
app.get('/db/:id', (req, res) => {

    // console.log('params:' + req.params.id);
    //console.log('query:' + req.query.a);

    switch (req.params.id) {

        case 'add':
            console.log('write');
            db.addSharedContent(  req.query.email,
                req.query.id_patient,
                req.query.date,
                req.query.content_id,
                req.query.content
            );
            break;

        case 'print':
            db.print();
            break;

        case 'remove':
            db.removeSharedContent(
                req.query.email,
                req.query.id_patient,
                req.query.date
            );

            break;

        case 'drop':
            db.drop();
            break;

        default:
            res.status(404).send('ERROR 404 this is not fantastic');
    }

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;