// now in this i will be defining the schema the collection names user base 
// in this i will storing the personal informations of the users which will be saved once they registers 
// requiring the mongoose module to define the schema for the document for this particular collection
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// defining the object for the schema as the object is itself the object which we need to pass to the schema function 
const userschema = {
    name: {
        type: String,
        require: true,

    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    Phonenumber: {
        type: Number,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        
    },
    confirmpassword: {
        type: String,
        require: true,
        
    }
};

const UserSchema = new mongoose.Schema(userschema);

// before exporting this  we have to add the hashing of the password so that we can protect this 
// this is also called the middleware which comes in between the two stages to make some changes 
// before going to the second stage and after the 1st stage 
UserSchema.pre("save", async function (next) {
    console.log(`The current password which is unhashed is ${this.password}`);
    // now we have to hash the password 
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`The current password after hashing it is ${this.password}`);
    next();
});

// now defining the new model for this 
const userdatabase = mongoose.model('userdatabase', UserSchema);

// say everything went fine 
module.exports = userdatabase;