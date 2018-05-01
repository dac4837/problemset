var User = require('../models/userModel');

class UserService {
	
	//Mock data
	/*
	var userData = [
		{
			_id:1,
			username: "DAC",
			fullName: "David Collins",
			isAdmin: true,
			password: "**********"
		},
		{
			_id:2,
			username: "P-Dawg",
			fullName: "Pearly Ezzio",
			isAdmin: false,
			password: "**********"
		},
		{
			_id:3,
			username: "Sparky",
			fullName: "Sparky the Dog",
			isAdmin: false,
			password: "**********"
		},
		{
			_id:4,
			username: "Jonnyboy",
			fullName: "John Smith",
			isAdmin: false,
			password: "**********"
		},
		{
			_id:5,
			username: "SquirrelHunter",
			fullName: "Ben Gleason",
			isAdmin: false,
			password: "**********"
		}
	];*/
	
	
	static setUsers(users) {
		users.forEach((user) => {
			var newUser = new User(user);
			newUser.save();
		});
	}
	
    //Get all
    static getAllUsers(){ 
         return User.find({})
        .then((users)=>{
            return users;
        });
    }
    
    //Get one
    static getUser(username){ 
         return User.findOne({'username': username})
        .then((user)=>{
            if (!user) throw newUserError("User " + username + " wasn't found", 404);
            return user;
        });
    }
    
    //Update one
    static updateUser(username, user){ 
        return User.findOne({'username': username})
        .then((foundUser)=>{
            //we didn't find a user to update
            if (!foundUser) throw newUserError("User " + username + " wasn't found", 404); 
            //There was an attempt to change the username or ID. DENIED
            if ((user._id && user._id != foundUser._id) || user.username != foundUser.username) throw newUserError("Cannot edit username or ID", 400);
            foundUser.set(user);
            foundUser.save();
            foundUser.password = "*****************";
            return foundUser;
        });
    }
    
    //create one
    static createUser(user) {
        var newUser = new User(user);
        return newUser.save()
        .then((savedUser) => {
            //omit password
            savedUser.password = "*****************";
            return savedUser;
        })
        .catch((err)=> {
           if(err.name == "BulkWriteError") throw newUserError("Unable to create user as the username " + user.username+ " is taken", 400);
           else throw err;
        });
    }
    
    //delete one
    static deleteUser(username) {
        return User.findOne({'username': username})
        .then((foundUser)=>{
            //we didn't find a user to update
            if (!foundUser) throw newUserError("User " + username + " wasn't found", 404);
            foundUser.remove()
            return;
        });
    }
}

//**** exports
module.exports = UserService;