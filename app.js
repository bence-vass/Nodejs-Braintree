var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose =  require('./mongooseConnect')
require('dotenv').config({path: '.env.development'})

var indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const checkout = require('./routes/checkout');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const cartsRouter = require('./routes/carts');
const orderRouter = require('./routes/orders')
const paymentRouter = require('./routes/payments')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/checkout', checkout);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/carts', cartsRouter);
app.use('/orders', orderRouter);
app.use('/payments', paymentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
