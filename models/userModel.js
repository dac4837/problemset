var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
    username: {type: String, required:true, index: { unique: true }},
    fullName: {type: String, required: true},
    isAdmin: {type: Boolean, required: true},
    password: { type: String, required: true, select: false } //omit the password when doing a get
    
});

//DB pre-write hook.
//Encrypt the password with a new user or updating password.
userSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

//Function to determin if the password matches the stored password
userSchema.methods.comparePassword = function(newPassword, cb) {
    bcrypt.compare(newPassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model("User", userSchema);