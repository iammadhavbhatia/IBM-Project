require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
const passport=require('passport');
const cookieSession=require('cookie-session')
require('./passport-setup');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieSession({
  name: 'tuto-session',
  keys: ['key1', 'key2']
}))
const isLoggedIn=(req,res,next)=>{
if(req.user){
	next()
}
else{
	res.sendStatus(401);
}
}
app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

 
// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});
app.get('/',(req,res)=>res.send('You Need to login'))

app.get('/failed',(req,res)=>res.send("you failed"))
app.get('/good',isLoggedIn,(req,res)=>res.send("you passed"))

app.get('/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/index.html');
  });

// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});