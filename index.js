const express   =   require('express');
const env   =   require('./config/environment');
const cookieParser  =   require('cookie-parser');
const app   =   express();
const port  =   8000;
const expressLayouts    =   require('express-ejs-layouts');
const db    =   require('./config/mongoose');
const session   =   require('express-session');
const passport = require('passport');
const passportLocal =   require('./config/passport');
const passportGoogleOAuth   =   require('./config/passportGoogleAuth');
const MongoStore    =   require('connect-mongo');
const flash =   require('connect-flash');
const customMware   =   require('./config/flashMiddleware');


app.use(express.urlencoded());
app.use(cookieParser());

//EJS
app.use(expressLayouts);
app.use(express.static('./assets'));
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.set('view engine','ejs');
app.set('views','./views');

//Express Session
//We have created session for flash messages
app.use(session({
    name: 'auth',
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge: (1000*60*100)
    },
    store: MongoStore.create(
        {
        mongoUrl: 'mongodb://127.0.0.1/nodejsAuthentication_development',
        autoRemove: 'disabled'
    },function(err){
        console.log(err || 'connect-mongodb setup ok');
    })
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//Connect-flash  
app.use(flash());
app.use(customMware.setFlash);


app.use('/',require('./routes/index'))

app.listen(port,function(err){
    if(err){
        console.log(`Error in running the server:${err}`);
    }
    console.log(`Server is running on: ${port}`);
})