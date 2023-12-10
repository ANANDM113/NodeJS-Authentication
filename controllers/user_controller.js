const User  =   require('../models/user');
const { session } = require('passport');
const resetPasswordFunc =   require('../mailers/user_mailer');
const randomToken   =   require('randomstring');

module.exports.registerYourself  =  function(request,response){
    try {
        return response.render('register.ejs',{
            title: 'Register'
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports.createUser  =  async function(request,response){
   
    try {

        if(request.body.password    !=  request.body.confirm_password){
            request.flash('error','Passwords do not Match');
            return response.redirect('back');
        }
        let user    =   await User.findOne({email: request.body.email})

        if(!user){
            const newUser   =   await User.create({
                name: request.body.name,
                email: request.body.email,
                password: request.body.password
            });
           //Hashing a Password
            newUser.password    =   newUser.generateHash(request.body.password);
            
            await newUser.save();
            
            request.flash('success','Registered Successfully');
            return response.redirect('/users/login');

        }else{
            return response.redirect('back');
        }
    } catch (error) {
        console.log(error);
        return response.status(500).json({
            message: 'Internal Serval Error'
        })
    }
}

module.exports.loginPage    =   function(request,response){
    try {
        return response.render('login.ejs',{
            title: 'Login'
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports.createSession    =   function(request,response){
    request.flash('success','Logged in Successfully');
    return response.redirect('/users/dashboard'); 
}

module.exports.dashBoard    =     function(request,response){

    User.findById(request.user._id)
    .then((user) => {
       user.accessToken =   randomToken.generate();
       user.isTokenValid    =   true;
       user.save();
        return response.render('dashboard.ejs',{
            title: "User Profile",
            profile_user:user
        })
    });
}

module.exports.forgotPassword    =   async function(request,response){
 
    return response.render('changePassword.ejs',{
        title: 'Password Reset',
        access: false

    });
}

module.exports.sendResetPasswordLinkViaEmail    =   async function(request,response){
    
    try {
        let user    =   await User.findOne({email: request.body.email});
        if(!user){
            request.flash('error','Email does not exist');
            return response.redirect('back');
        }else{
            if(user.isTokenValid    ==  false){
                user.accessToken    =   randomToken.generate();
                user.isTokenValid   =   true;
                await user.save();
            }
            resetPasswordFunc.resetPassword(user);
            request.flash('success','Password Reset Link is Sent to your Registered Email!');
            return response.redirect('/');
        }
    } catch (error) {
        request.flash('error','User does not exist');
        console.log(error);
        return response.redirect('back');
    }
}

module.exports.setNewPassword   =  async function(request,response){
    try {
        let user    =   await User.findOne({accessToken : request.params.accessToken});
        
        if(!user){
            request.flash('error','User does not exist');
            console.log('Error in finding user');
            return;
        } 
        if(user.isTokenValid){
            return response.render('changePassword.ejs',{
                title: 'Reset Password',
                access: true,
                accessToken: request.params.accessToken
            });
        }else{
            console.log('Error in rendering user');
        }
    } catch (error) {
        console.log('error',error);
    }
}

module.exports.setNewPasswordAfterLogIn   =  async function(request,response){
    try {
        let user    =   await User.findById(request.user._id);
        console.log(user);
        if(!user){
            request.flash('error','User does not exist');
            console.log('Error in finding user');
            return;
        } 
        if(user.isTokenValid){
            return response.render('changePasswordAfterLogIn.ejs',{
                title: 'Reset Password',
                access: true,
                accessToken: request.params.accessToken
            });
        }else{
            console.log('Error in rendering user');
        }
    } catch (error) {
        console.log('error',error);
    }
}

module.exports.updatePasswordInDataBase =   async function(request,response){
    try {
        let user    =  await User.findOne({accessToken : request.params.accessToken});

        if(!user){
            console.log('Error in finding user');
            return;
        }
        if(user.isTokenValid){
            if(request.body.newPass == request.body.confirmPass){
                user.password    =   user.generateHash(request.body.newPass);
                user.isTokenValid   =   false;
                user.save();
                request.flash('success','Password Updated Successfully');
                return response.redirect('/users/login');
            }else{
                request.flash('error','Password do not Match');
                return response.redirect('back');
            }
        }else{
            request.flash('error','Link Expired!');
            return response.redirect('/users/forgotPassword');
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports.updatePasswordInDataBaseAfterLogIn =   async function(request,response){
    try {
        let user    =   await User.findById(request.user._id);
        
        if(!user){
            console.log('Error in finding user');
            return;
        }
        if(user.isTokenValid){
            if(request.body.newPass == request.body.confirmPass){
                user.password    =   user.generateHash(request.body.newPass);
                user.isTokenValid   =   false;
                user.save();
                request.flash('success','Password Updated Successfully');
                return response.redirect('/users/login');
            }else{
                request.flash('error','Password do not Match');
                return response.redirect('back');
            }
        }else{
            request.flash('error','Link Expired!');
            return response.redirect('/users/forgotPassword');
        }

    } catch (error) {
        console.log(error);
    }
}


module.exports.destroySession   =   function(request,response){
    request.logout(function(err){
        if(err){
            return next(err);
        }
        request.flash('success','Logged out Successfully');
        return response.redirect('/')
    });
}