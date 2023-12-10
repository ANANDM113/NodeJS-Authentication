const passport  =   require('passport');
const LocalStrategy =   require('passport-local').Strategy;
const User  =   require('../models/user');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},

    async(request,email,password,done) =>
    {
        try {
            let user    =   await User.findOne({email: email})
            
            const isMatch =   user.comparePasswords(password,user.password);
            
            if(! user || isMatch == false){
                request.flash('success','Invalid Username/Password');
                return done(null,false);
            }
            return done(null,user);
        } catch (error) {
            console.log(error);
            request.flash('error',error);
            return done(error);
        }
    }
));

passport.serializeUser(function(user,done){
    done(null,user.id);
});


passport.deserializeUser(async(id,done) => {
    try {
        let user    =   await User.findById(id)
        return done(null,user);
    } catch (error) {
        console.log('Error in finding user Passport');
        return done(error);
    }
});

passport.checkAuthentication    =   function(request,response,next){
    //if the user is signed in, then pass on the request to the next function(controllers's action)
    if(request.isAuthenticated()){
        return next();
    }
    //if the user is not signed in
    return response.redirect('/users/login');
}
//middleware to access the authenticated user in the views
passport.setAuthenticatedUser   =   function(request,response,next){
    if(request.isAuthenticated()){
        //request.user contains the current signed in user from the session cookie and we are 
        //just sending this to the locals for the views
        response.locals.user =   request.user;
    }
    next();
}
module.exports  =   passport;
