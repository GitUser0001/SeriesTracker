var mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema;

var User = require('models/user').User;


/*
var UserTest = new Schema({
    name: {
        type: String,
        unique: true,
    },
    title: String
});
exports.UserTest = mongoose.model('UserTest', UserTest);
*/
var schema = new Schema({
    users: [User],
    url:{
        type: String,
        trim: true,
        unique: true,
        required: true,
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please fill a valid email address']
    },
    name:{
        type: String,       
        unique: true,
        required: true
    },
    description:{
        type:String,
        default: "Some default information"
    },
    image:{
        type: Buffer,
        required: false
    },
    contentType:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        min: 0, max: 100,
        default: 0
    },
    country:{
        type: String,
        default: "Some country"
    },
    releaseYear:{
        type: Number,
        default: 1990
    }
});

exports.Series = mongoose.model('Series', schema);


