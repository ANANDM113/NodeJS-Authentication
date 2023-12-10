const passport  =   require('passport');
const googleStrategy    =   require('passport-google-oauth').OAuth2Strategy;
const randomPass    =   require('randomstring');
const User  =   require('../models/user');
const env   =   require('./environment');

passport.use(new googleStrategy({
    clientID: env.google_clientID,
    clientSecret: env.google_clientSecret,
    callbackURL: env.google_callbackURL

},async(accessToken,refreshToken,profile,done) => {
   
    let user    =   await User.findOne({email: profile.emails[0].value}).exec();

    if(user){
        return done(null,user);
    }else if(!user){
        await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: randomPass.generate()
        })
    }else{
        return done(null,false);
    }
    return done(null,user);
}));

module.exports  =   passport;
