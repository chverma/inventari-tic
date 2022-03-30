require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8080;
var path = require('path');
var Session = require('express-session');
const nocache = require('nocache');
const cors = require('cors');
const redis = require('redis');
const redisStore = require('connect-redis')(Session);
const socket = {
    host: process.env.REDIS_HOST,
    port: 6379
}
const redisClient = redis.createClient({ legacyMode: true , socket: socket });

redisClient.on('error', function(err) {
    console.log('*Redis Client Error: ' + err.message);
});
redisClient.on('connect', function() {
    console.log('Connected to redis instance');
});

(async() => {
    // Connect to redis server
    await redisClient.connect();
})();

global.Buffer = global.Buffer || require('buffer').Buffer;

if (typeof btoa === 'undefined') {
    global.btoa = function(str) {
        return new Buffer(str, 'binary').toString('base64');
    };
}

if (typeof atob === 'undefined') {
    global.atob = function(b64Encoded) {
        return new Buffer(b64Encoded, 'base64').toString('binary');
    };
}

app.use(nocache());

// Init Session
app.use(Session({
    secret: 'raysources-secret-19890913007',
    resave: false,
    saveUninitialized: false,
    store: new redisStore({ client: redisClient }),
    //cookie: { maxAge: 60000 }
}));

app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    console.log("-----------------log route", req.path);
    next();
})

function checkUser(req, res, next) {
    var authheader = req.headers.authorization;
    var api_token;
    if (authheader) {
        api_token = authheader.split(' ')[1].split(':')[0];
    }
    if ((req.path === '/login' || req.path === '/login.html') || (req.session && req.session.userData) || (api_token === process.env.INVENTORY_TOKEN)) {
        return next();
    } else {
        //authenticate user
        return res.redirect(301, '/login.html');
    }
}

app.use(checkUser);


// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Configure bodyParser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.raw({ limit: '50mb' }));
app.use(bodyParser.text({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



var inventoryRoutes = require('./app/routes/routesInventory');
inventoryRoutes(app);
var locationRoutes = require('./app/routes/routesLocation');
locationRoutes(app);
var typeRoutes = require('./app/routes/routesType');
typeRoutes(app);
var userRoutes = require('./app/routes/routesUser');
userRoutes(app);
var inventorySaiRoutes = require('./app/routes/routesInventorySai');
inventorySaiRoutes(app);
var userRoutes = require('./app/routes/routesUser');
userRoutes(app);


// Listen & run server
app.listen(port, function() {
    console.log('App listening on port 8080');
});