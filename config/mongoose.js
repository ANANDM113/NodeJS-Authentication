const mongoose  =   require('mongoose');

//mongoose.connect(`mongodb://127.0.0.1/nodejsAuthentication_development`);

mongoose.connect(`mongodb+srv://nodeJSAuth:3IXaIyG77ucFpQCq@nodejs-auth.tayfvri.mongodb.net/`);


const db    =   mongoose.connection;

db.on('error',console.error.bind(console,'Error connecting to Mongodb'));

db.once('open',function(){
    console.log('Connected to Database :: MongoDB');
});

module.exports  =   db;