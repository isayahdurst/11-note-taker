const express = require('express');
const fs = require('fs');
const chalk = require('chalk');
const db = require('./db/db.json');
const uuid = require('uuid');

const app = express();
const PORT = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
});

app.get('/api/notes', (req, res) => {
    res.json(JSON.parse(fs.readFileSync('./db/db.json', 'utf-8')));
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    res.json(addNote(text, title));
});

app.delete('/api/notes/:id', (req, res) => {
    const notelist = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    const newList = notelist.filter((note) => note.id != req.params.id);
    fs.writeFileSync('./db/db.json', JSON.stringify(newList, null, 4));
    res.end();
});

app.listen(PORT, () => {
    console.log(chalk.red(`Server listening on PORT: ${chalk.yellow(PORT)}`));
});

const addNote = function (text, title) {
    const notesList = JSON.parse(
        fs.readFileSync('./db/db.json', 'utf-8') || []
    );

    const note = {
        title: title,
        text: text,
        id: uuid.v4(),
    };

    notesList.push(note);
    fs.writeFileSync('./db/db.json', JSON.stringify(notesList, null, 4));
    return note;
};
