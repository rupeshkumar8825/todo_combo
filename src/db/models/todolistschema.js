// writing the schema for the todolist database in which we will be storing the todolists of the user 
// we will be using the mongoose for this purpose 
const mongoose = require('mongoose');

// defining the schema as follows 
const schema = {
    databaseid: {
        type: String,
        
    },
    completedwork: {
        type: Array,
    },
    notcompletedwork: {
        type: Array,
    },
    completedhome: {
        type: Array,
    },
    notcompletedhome: {
        type: Array,
    },
    completedcollege: {
        type: Array
    },
    notcompletedcollege: {
        type: Array,
    },
    completedpersonal: {
        type: Array
    },
    notcompletedpersonal: {
        type: Array,
    },
    completedlife: {
        type: Array
    },
    notcompletedlife: {
        type: Array,
    },
    completedtodos: {
        type: Number
    },
    notcompletedtodos: {
        type: Number
    },
    notes: {
        type: Array
    },
    notestitle: {
        type: Array
    }
    
    
};

const todolistschema = new mongoose.Schema(schema);

// now defining the instance of the new schema for this purpose 
const todolist = new mongoose.model('todolistbase', todolistschema);

// exporting this module to the main server for this to accessed to the main server 
module.exports = todolist;