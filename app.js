const path = require('path');

const express = require('express');

const errorController = require('./controllers/errorController');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(errorController.get404);

app.listen(3000);
