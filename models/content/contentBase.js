var mongoose = require('lib/mongoose'),
    Schema = mongoose.Schema;

var User = require('models/user').User;

/*
Content.find({})
    .populate('users.id')
    .exec(function(error, content) {
        console.log(JSON.stringify(content, null, "\t"))
    });
*/

var schema = new Schema({
    users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
    }],
    name:{
        type: String,
        default: 'someDefaultName'               
    },
    url: {
        type: String,
        default: "def"
    }
});

schema.methods.addUserById = function (id) {
    
    this.users.addToSet(id);
    
    /*
    mongoose.models.Content.update(
        {_id: this._id},
        {$addToSet: {users: id}},
        function (err, numAffected) {
            if (err) throw err;
        });
     */
};

schema.methods.deleteUserById = function (id) {
    this.users.delete(id);
};

exports.Content = mongoose.model('Content', schema);

