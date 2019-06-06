const express = require('express');
const path = require('path');
const connect = require('./schemas');


// Initialization
const app = express();
require('dotenv').config();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 9004);


// Middlewares
app.use(express.static(path.join(__dirname, 'public')));


// Routers
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {} ;
    res.status(err.status || 500);
    res.render('error');
});

const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), 'port listening...');
});