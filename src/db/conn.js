// here i will be making the connection to the database for storing the data of the user 
const mongoose = require("mongoose");

// now calling the function to make the connection for the database 
// this returns a promise and hence we have to use the then and the catch functions to handle the promise 
mongoose.connect("mongodb://localhost:27017/studentcombo", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,

}).then(() => {
    console.log(`connection successful for the database `)
}).catch((e) => {
    console.log(`no connection`);
});

// say everything went fine 
