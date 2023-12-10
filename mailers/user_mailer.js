const nodemailer    =   require('../config/nodemailer');
const env   =   require('../config/environment');

exports.resetPassword   =   (user) => {
    let htmlString  =   nodemailer.renderTemplate({user: user},'/users/userMailer.ejs');

    nodemailer.transporter.sendMail({
        from: env.smtp.auth.user,
        to: user.email,
        subject: "Reset Your Password!!!",
        html: htmlString
    },(err,info) => {
        if(err){
            console.log('Error in sending email',err);
            return;
        }
        console.log('Message Sent',info);
        return;
    });
}