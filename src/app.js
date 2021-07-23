// now writing the code for the backend using the express js 
const express = require('express')
const ejs = require('ejs');
const app = express();
const path = require('path');
const { urlencoded } = require('express');
const userdatabase = require('./db/models/users');
const todolistbase = require('./db/models/todolistschema');
const todolist = require('./db/models/todolistschema');
const { time } = require('console');
const bcrypt = require('bcrypt');
const { REPLServer } = require('repl');
require('./db/conn');





// we have to require the connection file to get connected with the databse that we have created
var presentuser = 1;



const port = 8000;
const staticpath = path.join(__dirname, "../public");




// now telling the express to serve the file which is kept in the public folder 
// this line is needed inspite that we are using the views or the template engines because we are using the css in that folder only that is in the public folder only
// now we are using the views directory so we have to set the view engine to use this 
// using the urlencoded for getting the data from the form on the console 
app.use(express.static(staticpath));
app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: false }));




// ###############################################################################################
// ############################ ROUTING FOR THE HOME PAGE ########################################
// #############################################################################################





// now making the small server to serve the static file that we have right now 
app.get("/", (req, res) => {
    res.render("index");
});



// creating the routing for the website that we have created right now
app.get('/signup', (req, res) => {
    if (presentuser != 1) {
        console.log("the user is already signed in hence directing this to todolist");
        res.redirect('todolist');
    }
    console.log("hi i am at the registration page a new user comes in ");
    res.render('register');
});




app.get("/signin", (req, res) => {
    presentuser = 1;
    console.log("your are right now on the sign in page ");
    res.render('signin');
});



// handling the post request for the registration purpose 
app.post('/signup', async (req, res) => {
    console.log(req.body);
    presentuser = 0;
    // applying the if else statement
    if (req.body.password === req.body.confirmpassword) {
    
        const newuser = new userdatabase({
            name: req.body.myname,
            email: req.body.myemail,
            Phonenumber: req.body.mynumber,
            password: req.body.mypassword,
            confirmpassword: req.body.myconfirmpassword,
        });
        //  before saving we have to protect the password using the hash technique
        newuser.confirmpassword = undefined;

        // now saving the user to the databasE
        const result = await newuser.save();
        console.log(result);


        // this time we have to insert only one new user to the database 
        console.log("successfully registered");
        res.redirect("/signin");
        
    }
    else {

        // res.send("password is not correct, please try again");
        console.log("the password is not correct for ths purspe ");
        res.render("404");
    }
    
});





// defining the function to find all the todolist 
async function  giveAllCompletedTodos(presentuser) {
    const id = String(presentuser.id);
    const currentusertodo = await todolistbase.findOne({ databaseid: id });
    let arr = new Array;
   
    

    // using the for loops for this purpose 
    currentusertodo.completedwork.forEach(element => {
        arr.push(element);
    });
    currentusertodo.completedhome.forEach(element => {
        arr.push(element);
    });
    currentusertodo.completedcollege.forEach(element => {
        arr.push(element);
    });
    currentusertodo.completedlife.forEach(element => {
        arr.push(element);
    });
    currentusertodo.completedpersonal.forEach(element => {
        arr.push(element);
    });
    


    console.log("the value of the array inside the giveallcompletedtodo function ");
    console.log(arr);
    
    // say everything went fine
    return arr;
}





// defining the function to find all the todolist 
async function  giveAllnotCompletedTodos(presentuser) {
    const id = String(presentuser.id);
    const currentusertodo = await todolistbase.findOne({ databaseid: id });
    let arr = new Array;
    // console.log(currentusertodo.work);
    // console.log(currentusertodo.home);
    // using the for loops for this purpose 
    currentusertodo.notcompletedwork.forEach(element => {
        arr.push(element);
    });
    currentusertodo.notcompletedhome.forEach(element => {
        arr.push(element);
    });
    currentusertodo.notcompletedcollege.forEach(element => {
        arr.push(element);
    });
    currentusertodo.notcompletedlife.forEach(element => {
        arr.push(element);
    });
    currentusertodo.notcompletedpersonal.forEach(element => {
        arr.push(element);
    });
    
    console.log("the value of the array inside the giveallnotcompletedtodo function ");
    console.log(arr);
    
    // say everything went fine
    return arr;
}




// ###############################################################################################
// ############################ ROUTING FOR THE TODOLIST PAGE ########################################
// #############################################################################################





// handling the get request for the todolist page 
app.get("/todolist", async(req, res) => {
    
    // applying the if else statement for checking whether the user has not entered without signin
    if (presentuser == 1) {
        // res.send("please go back to home page and then signin first to access this ");
        res.render('404')
    }
    else {

        // here we have to pass the data also that is to get the list of all todos 
        // finding the list of all todolist 
        let completedtodosarr = new Array;
        completedtodosarr = await giveAllCompletedTodos(presentuser);
        console.log("the list of all todos are as follows");
        console.log(completedtodosarr);
        
        let notcompletedtodosarr = new Array;
        notcompletedtodosarr = await giveAllnotCompletedTodos(presentuser);
        console.log("the list of all not completed todos are as follows");
        console.log(notcompletedtodosarr);


        let size1 = completedtodosarr.length;
        console.log(size1);
        
        let size2 = notcompletedtodosarr.length;
        console.log(size1);
        console.log(size2);



        // defining the object to pass the data to the front end that is using ejs 
        const data = {
            completedtodosarr: completedtodosarr,
            completedsize: size1,
            notcompletedtodosarr: notcompletedtodosarr,
            notcompletedsize: size2,
            completedtodos: presentuser.completedtodos,
            notcompletedtodos: presentuser.notcompletedtodos
        };


        res.render('todolist', { data });
        console.log("right now the user is on todolist page");        
    }

});










// now handling the post request to check whether the user has entered the correct details or not 
app.post("/signin", async (req, res) => {
  
    console.log(req.body);  
    presentuser = await userdatabase.findOne({ name: req.body.myusername });
    if (presentuser == null) {
        res.render('404');
    }
    console.log(req.body.mypassword);
    console.log(presentuser.password);
    // here i have to compare the two passwords 
    const isvalid = await bcrypt.compare(req.body.mypassword, presentuser.password);
    // applying the if else statement 
    if (isvalid == true) {
        console.log("the details of the present user is as follows:");
        console.log(presentuser);
        console.log(presentuser.id);
        const id = String(presentuser.id);
        const tod = await todolistbase.countDocuments({databaseid:id});
        console.log("the todolist of the presentuser");
        console.log(tod);
        if (tod != 0) {
            console.log("this is not the first time signing in user ");
            
    
            let arr1 = new Array;
            arr1 = await giveAllCompletedTodos(presentuser);
            console.log("all the current available completed todos todolist are as follows ");
            console.log(arr1);

            let arr2 = new Array;
            arr2 = await giveAllnotCompletedTodos(presentuser);
            console.log("all the current available not  completed todos todolist are as follows ");
            console.log(arr2);
            res.redirect('todolist');
        }
        else {
            
            console.log("this user is logging in for the 1st time");
    
            const newtodolistdocument = new todolistbase({
                databaseid: id,
                completedwork: ['finish presentation today', 'meeting with boss today'],
                notcompletedwork: ['not completed todos for work section'],
                completedhome: ['go to market', 'fix the leakage in the tap'],
                notcompletedhome: ['not completed todos for home section'],
                completedcollege: ['submit the coding assignment', 'solve 5 dsa question'],
                notcompletedcollege: ['not completed todos for college section'],
                completedpersonal: ['call vivek', 'do meditation', 'read about Elon Musk'],
                notcompletedpersonal: ['not completed todos for personal section'],
                completedlife: ['talk to grandpa', 'talk to friends', 'focus on health'],
                notcompletedlife: ['not completed todos for life section'],
                completedtodos: 0,
                notcompletedtodos: 0,
                notes: ['you can your notes here along with title', 'hurry add your first note'],
                notestitle: ['info1', 'info2']
            });

            

            // once this is created then we have to save this to the database 
            const result = await newtodolistdocument.save();
            console.log("the saved document in the todolist base is as follows ");
            console.log(result);
            let arr = new Array;
            arr = await giveAllCompletedTodos(presentuser);
            console.log("the list of all the completed todolist is as follows");
            console.log(arr);
            let arr2 = new Array;
            arr2 = await giveAllnotCompletedTodos(presentuser);
            console.log("the list of all the not completed todolist is as follows");
            console.log(arr2);


            // finally rendering the todolist 
            res.redirect('todolist');
        }
    }
    else {
        // res.send("invalid login credentials ");
        console.log("the user has entered invalid login credentials");
        res.render("404");
    }
});






// defining the function to update the value of the todolist section of the current user 
async function addNewTodo(presentuser, newtask, newtasksection) {
    const id = String(presentuser.id);
    let currentusertodo = await todolistbase.findOne({ databaseid: id });
    console.log("the currentusertodo is as folllows");
    console.log(currentusertodo);
    console.log("now i am updating the value of the required ");

    
    newtask = newtask.trim();
    let arr = new Array;

    

    if (newtasksection === 'work') {
        console.log('adding to the work');
        arr = currentusertodo.notcompletedwork;
        arr.push(newtask);
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { notcompletedwork: arr } });
        console.log("done updating the array of notcompleted work");
        console.log(result);
        currentusertodo = await todolistbase.findOne({ databaseid: id });
        console.log("the updated section is as follows ");
        console.log(currentusertodo.notcompletedwork);
    }
    else if (newtasksection === 'life') {
        console.log("adding to the life");
        arr = currentusertodo.notcompletedlife;
        arr.push(newtask);
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { notcompletedlife: arr } });
        console.log("done updating the array of notcompleted life");
        console.log(result);
        currentusertodo = await todolistbase.findOne({ databaseid: id });
        console.log("the updated section is as follows ");
        console.log(currentusertodo.notcompletedlife);
    }
    else if (newtasksection === 'personal') {
        console.log('adding to the personal');
        arr = currentusertodo.notcompletedpersonal;
        arr.push(newtask);
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { notcompletedpersonal: arr } });
        console.log("done updating the array of notcompleted personal");
        console.log(result);
        currentusertodo = await todolistbase.findOne({ databaseid: id });
        console.log("the updated section is as follows ");
        console.log(currentusertodo.notcompletedpersonal);
    }
    else if (newtasksection === 'home') {
        console.log('adding to the home');
        arr = currentusertodo.notcompletedhome;
        arr.push(newtask);
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { notcompletedhome: arr } });
        console.log("done updating the array of notcompleted home");
        console.log(result);
        currentusertodo = await todolistbase.findOne({ databaseid: id });
        console.log("the updated section is as follows ");
        console.log(currentusertodo.notcompletedhome);
    }
    else if (newtasksection === 'college') {
        console.log('adding to the college');
        arr = currentusertodo.notcompletedcollege;
        arr.push(newtask);
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { notcompletedcollege: arr } });
        console.log("done updating the array of notcompleted college");
        console.log(result);
        currentusertodo = await todolistbase.findOne({ databaseid: id });
        console.log("the updated section is as follows ");
        console.log(currentusertodo.notcompletedcollege);
    }


}




async function find_section_forcompleted(currentusertodo, tasktodelete) {
    let section = 1;
    currentusertodo.completedwork.forEach(element => {
        if (element === tasktodelete) {
            section = 1;
            // deleteTodoforCompleted(section, currentusertodo, tasktodelete)
        }
    });
    currentusertodo.completedhome.forEach(element => {
        if (element === tasktodelete) {
            section = 2;
            // deleteTodoforCompleted(section, currentusertodo, tasktodelete)
        }
    });
    currentusertodo.completedcollege.forEach(element => {
        if (element === tasktodelete) {
            section = 3;
            // deleteTodoforCompleted(section, currentusertodo, tasktodelete)
        }
    });
    currentusertodo.completedlife.forEach(element => {
        if (element === tasktodelete) {
            section = 4;
            // deleteTodoforCompleted(section, currentusertodo, tasktodelete)
        }
    });
    currentusertodo.completedpersonal.forEach(element => {
        if (element === tasktodelete) {
            section = 5;
            // deleteTodoforCompleted(section, currentusertodo, tasktodelete)
        }
    });

    return section;
}






async function find_section_fornotcompleted(currentusertodo, tasktodelete) {
    let section = 0;
    currentusertodo.notcompletedwork.forEach(element => {
        console.log("this is  work section");
        console.log(element);
        console.log("the current tasktodelete is ");
        console.log(tasktodelete);
        console.log("the length of the element is as follows ");
        console.log(element.trim().length);
        console.log("the length of the tasktodelete is as follows");
        console.log(tasktodelete.trim().length);

        if (element.trim() === tasktodelete.trim()) {
            console.log("this is from work section");
            section = 1;
            // deleteTodoforCompleted(section, currentusertodo, tasktodelete)
        }
    });
    currentusertodo.notcompletedhome.forEach(element => {
        if (element.trim() === tasktodelete.trim()) {
            console.log("this is from home section");
            section = 2;
            // deleteTodoforCompleted(section, currentusertodo, tasktodelete)
        }
    });
    currentusertodo.notcompletedcollege.forEach(element => {
        if (element.trim() === tasktodelete.trim()) {
            console.log("this is from college section");
            section = 3;
            // deleteTodoforCompleted(section, currentusertodo, tasktodelete)
        }
    });
    currentusertodo.notcompletedlife.forEach(element => {
        if (element.trim() === tasktodelete.trim()) {
            console.log("this is from life section");
            section = 4;
            // deleteTodoforCompleted(section, currentusertodo, tasktodelete)
        }
    });
    currentusertodo.notcompletedpersonal.forEach(element => {
        if (element.trim() === tasktodelete.trim()) {
            console.log("this is from personal section");
            section = 5;
            // deleteTodoforCompleted(section, currentusertodo, tasktodelete)
        }
    });
    console.log("the section value inside the find_section_fornotocmple is");
    console.log(section);
    return section;
}




async function deleteTodofornotcompleted(count, currentusertodo, tasktodelete) {
    
    const id  = String(presentuser.id)
    // applying the if else statement for fidnign the section to which this belongs to     
    if (count == 1) {
        // this means that this belongs to the work section 
        console.log("this belongs to the not completed tasks for the work section");
        // now we have to call the delete function for the not completed and completed
        let arr = new Array;
        currentusertodo.notcompletedwork.forEach(element => {
            if (element.trim() != tasktodelete.trim()) {
                arr.push(element.trim());
            }
        });
        console.log("the value of the arr after deleting is as follows");
        console.log(arr);

        // now passing this to the function to delete this 
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { notcompletedwork: arr } });
        console.log("the updated value of the arr is as follows");
        console.log(result);
        // res.redirect('todolist');
    }
    else if (count == 2) {
        // this means that this belongs to the work section 
        console.log("this belongs to the not completed tasks for the home section");
        
        // now we have to call the delete function for the not completed and completed
        let arr = new Array;
        currentusertodo.notcompletedhome.forEach(element => {
            if (element.trim() != tasktodelete.trim()) {
                arr.push(element.trim());
            }
        });

        // now passing this to the function to delete this 
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { notcompletedhome: arr } });
        console.log("the updated value of the arr is as follows");
        console.log(result);
        // res.redirect('todolist');
    }
    else if (count == 3) {
        // this means that this belongs to the work section 
        console.log("this belongs to the not completed tasks for the college section");
        
        // now we have to call the delete function for the not completed and completed
        let arr = new Array;
        currentusertodo.notcompletedcollege.forEach(element => {
            if (element.trim() != tasktodelete.trim()) {
                arr.push(element.trim());
            }
        });
        

        // now passing this to the function to delete this 
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { notcompletedcollege: arr } });
        console.log("the updated value of the arr is as follows");
        console.log(result);
        // res.redirect('todolist');

    }
    else if (count == 4) {
        // this means that this belongs to the work section 
        console.log("this belongs to the not completed tasks for the life section");
        
        // now we have to call the delete function for the not completed and completed
        let arr = new Array;
        currentusertodo.notcompletedlife.forEach(element => {
            if (element.trim() != tasktodelete.trim()) {
                arr.push(element.trim());
            }
        });

        // now passing this to the function to delete this 
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { notcompletedlife: arr } });
        console.log("the updated value of the arr is as follows");
        console.log(result);
        // res.redirect('todolist');

    }
    else if (count == 5) {
                // this means that this belongs to the work section 
        console.log("this belongs to the not completed tasks for the personal section");
        
        // now we have to call the delete function for the not completed and completed
        let arr = new Array;
        currentusertodo.notcompletedpersonal.forEach(element => {
            if (element.trim() != tasktodelete.trim()) {
                arr.push(element.trim());
            }
        });

        // now passing this to the function to delete this 
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { notcompletedpersonal: arr } });
        console.log("the updated value of the arr is as follows");
        console.log(result);
        // once it is done then we have to redirect this page to the todolist 
        // res.redirect('todolist');
    }
}








// for deleting the todo from the viewall page
app.post("/todolist-viewallpage-delete", async (req, res) => {
    console.log(" we will delete this todo from the list ");
    console.log(req.body);
    const tasktodelete = (req.body.tasktodelete);
    console.log("the task to be deletes is as follows ");
    console.log(tasktodelete);
    // now we have to search this that which section does this belong to 
    // calling the function to find the same 
    const id = String(presentuser.id);
    const currentusertodo = await todolistbase.findOne({ databaseid: id });

    const count = await find_section_fornotcompleted(currentusertodo, tasktodelete);
    console.log("the section for this tasktobedeleted is as follows");
    console.log(count);
    // calling the function to delete the task and then update the database too 
    deleteTodofornotcompleted(count, currentusertodo, tasktodelete);
    // res.redirect("todolist");
    const reply = {
        msg:"successfully done"
    }
    
    res.json(reply);
    // res.send(" hi your todo task is being deleted from the database ");

});






// defining the function to update the completed part of the todolist of each section 
async function addTodotoCompleted(count, currentusertodo, tasktomarkcompleted) {
    const id = String(presentuser.id);
    tasktomarkcompleted = tasktomarkcompleted.trim();
    // applying the if else statement for fidnign the section to which this belongs to     
    if (count == 1) {
        // this means that this belongs to the work section 
        console.log("this will be added to the completed tasks for the work section");
        
        // now we have to call the delete function for the not completed and completed
        let arr = new Array;
        arr = currentusertodo.completedwork;
        arr.push(tasktomarkcompleted.trim());

        console.log("the value of the arr after adding to completed is as follows");
        console.log(arr);

        // now passing this to the function to delete this 
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { completedwork: arr } });
        console.log("the updated value of the arr is as follows");
        console.log(result);
        // res.redirect('todolist');
    }
    else if (count == 2) {
        // this means that this belongs to the work section 
        console.log("this belongs to the completed tasks for the home section");
        
        // now we have to call the delete function for the not completed and completed
        let arr = new Array;
        arr = currentusertodo.completedhome
        arr.push(tasktomarkcompleted);

        

        // now passing this to the function to delete this 
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { completedhome: arr } });
        console.log("the updated value of the arr is as follows");
        console.log(result);
        // res.redirect('todolist');
    }
    else if (count == 3) {
        // this means that this belongs to the work section 
        console.log("this belongs to the completed tasks for the college section");
        
        // now we have to call the delete function for the not completed and completed
        let arr = new Array;
        arr = currentusertodo.completedcollege;
        arr.push(tasktomarkcompleted);
        // now passing this to the function to delete this 
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { completedcollege: arr } });
        console.log("the updated value of the arr is as follows");
        console.log(result);
        // res.redirect('todolist');

    }
    else if (count == 4) {
        // this means that this belongs to the work section 
        console.log("this belongs to the completed tasks for the life section");
        
        // now we have to call the delete function for the not completed and completed
        let arr = new Array;
        arr = currentusertodo.completedlife;
        arr.push(tasktomarkcompleted);

        // now passing this to the function to delete this 
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { completedlife: arr } });
        console.log("the updated value of the arr is as follows");
        console.log(result);
        // res.redirect('todolist');

    }
    else if (count == 5) {
                // this means that this belongs to the work section 
        console.log("this belongs to the  completed tasks for the personal section");
        
        // now we have to call the delete function for the not completed and completed
        let arr = new Array;
        arr = currentusertodo.completedpersonal;
        arr.push(tasktomarkcompleted);
        // now passing this to the function to delete this 
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { completedpersonal: arr } });
        console.log("the updated value of the arr is as follows");
        console.log(result);
        // once it is done then we have to redirect this page to the todolist 
        // res.redirect('todolist');
    }
}






// listenig to the post request to add the notcompleted todo task to the completed one 
app.post("/todolist-viewallpage-addtocompleted", async (req, res) => {
    console.log("right now i am marking the task as completed ");
    console.log(req.body);
    const tasktotick = req.body.tasktotick;
    console.log("the task to tick is as follows ");
    console.log(tasktotick);

    const id = String(presentuser.id);
    const currentusertodo = await todolistbase.findOne({ databaseid: id });

    // first we have to find the section to which this belongs to 
    const count = await find_section_fornotcompleted(currentusertodo, tasktotick);
    console.log("this belongs to section");
    console.log(count);

    // calling the function to delete this
    deleteTodofornotcompleted(count, currentusertodo, tasktotick);

    // calling the function to add this to the completedtodo of the corresponding section 
    addTodotoCompleted(count, currentusertodo, tasktotick);

    const reply = {
        msg: "the task has been successfully  added to the completed section of given section"
    };

    // say everything went fine 
    res.json(reply);
    
});








async function deleteTodoforCompleted(count, currentusertodo, tasktodelete) {
    
    const id  = String(presentuser.id)
    // applying the if else statement for fidnign the section to which this belongs to     
    if (count == 1) {
        // this means that this belongs to the work section 
        console.log("this belongs to the completed tasks for the work section");
        // now we have to call the delete function for the  completed and completed
        let arr = new Array;
        currentusertodo.completedwork.forEach(element => {
            if (element.trim() != tasktodelete.trim()) {
                arr.push(element.trim());
            }
        });
        console.log("the value of the arr after deleting is as follows");
        console.log(arr);

        // now passing this to the function to delete this 
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { completedwork: arr } });
        console.log("the updated value of the arr is as follows");
        console.log(result);
        // res.redirect('todolist');
    }
    else if (count == 2) {
        // this means that this belongs to the work section 
        console.log("this belongs to the completed tasks for the home section");
        
        // now we have to call the delete function for the not completed and completed
        let arr = new Array;
        currentusertodo.completedhome.forEach(element => {
            if (element.trim() != tasktodelete.trim()) {
                arr.push(element.trim());
            }
        });

        // now passing this to the function to delete this 
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { completedhome: arr } });
        console.log("the updated value of the arr is as follows");
        console.log(result);
        // res.redirect('todolist');
    }
    else if (count == 3) {
        // this means that this belongs to the work section 
        console.log("this belongs to the completed tasks for the college section");
        
        // now we have to call the delete function for the not completed and completed
        let arr = new Array;
        currentusertodo.completedcollege.forEach(element => {
            if (element.trim() != tasktodelete.trim()) {
                arr.push(element.trim());
            }
        });

        // now passing this to the function to delete this 
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { completedcollege: arr } });
        console.log("the updated value of the arr is as follows");
        console.log(result);
        // res.redirect('todolist');

    }
    else if (count == 4) {
        // this means that this belongs to the work section 
        console.log("this belongs to the  completed tasks for the life section");
        
        // now we have to call the delete function for the not completed and completed
        let arr = new Array;
        currentusertodo.completedlife.forEach(element => {
            if (element.trim() != tasktodelete.trim()) {
                arr.push(element.trim());
            }
        });

        // now passing this to the function to delete this 
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { completedlife: arr } });
        console.log("the updated value of the arr is as follows");
        console.log(result);
        // res.redirect('todolist');

    }
    else if (count == 5) {
                // this means that this belongs to the work section 
        console.log("this belongs to the completed tasks for the personal section");
        
        // now we have to call the delete function for the not completed and completed
        let arr = new Array;
        currentusertodo.completedpersonal.forEach(element => {
            if (element.trim() != tasktodelete.trim()) {
                arr.push(element.trim());
            }
        });

        // now passing this to the function to delete this 
        const result = await todolistbase.updateOne({ databaseid: id }, { $set: { completedpersonal: arr } });
        console.log("the updated value of the arr is as follows");
        console.log(result);
        // once it is done then we have to redirect this page to the todolist 
        // res.redirect('todolist');
    }
}








// now we have to write the logic for the deletion from the completed tasks that we have 
// handling the post request from the server 
app.post("/delete-completed-todos", async (req, res) => {
    console.log("deleting the todolist from completed section ");
    console.log(req.body);
    console.log("the task to be deleted is as follows");
    console.log(req.body.tasktodelete);
    const tasktodelete = req.body.tasktodelete;

    const id = String(presentuser.id);
    const currentusertodo = await todolistbase.findOne({ databaseid: id });

    // now we have to find the section for this purpose 
    const count = await find_section_forcompleted(currentusertodo, tasktodelete);
    console.log("this task belonsg to the section ");
    console.log(count);

    // calling the function to delete this from the completed section 
    deleteTodoforCompleted(count, currentusertodo, tasktodelete);

    const reply = {
        msg: "the task has been successfully  added to the completed section of given section"
    };

    // say everything went fine 
    res.json(reply);
    
});









// handling the get requests for the different section of the todolist 
app.get('/work',  async(req, res) => {
    console.log("user is in the work section");
    const id = String(presentuser.id);
    const currentusertodo = await todolistbase.findOne({ databaseid: id });
    let arr = new Array;
    arr = currentusertodo.completedwork;
    let l1 = arr.length;

    let arr2 = new Array;
    arr2 = currentusertodo.notcompletedwork;
    let l2 = arr2.length;

    const data = {
        size1: l1,
        size2: l2,
        notcompletedtodos: arr2,
        completedtodos: arr
    };

    // passing this data to the frontend part to show the relevant information 
    res.render('work', {data});
});


// request for adding the new todo to the work section 
app.post("/add-new-worktodo", async (req, res) => {
    console.log("adding the new todo in the work section ");
    console.log(req.body);
    const tasktoadd = req.body.tasktoadd;
    console.log("the task to be added is as follows ");
    console.log(tasktoadd);

    // calling the function to add this to the database 
    addNewTodo(presentuser, tasktoadd, "work");

    const reply = {
        msg: "added successfully"
    };

    res.json(reply);

});



// for life page the post and get request handling
app.get("/life", async (req, res) => {
    console.log("user is on the life section page");

    const id = String(presentuser.id);
    const currentusertodo = await todolistbase.findOne({ databaseid: id });
    let arr1 = new Array;
    let arr2 = new Array;

    arr1 = currentusertodo.completedlife;
    arr2 = currentusertodo.notcompletedlife;

    let size1 = arr1.length;
    let size2 = arr2.length;

    const data = {
        size1: size1,
        size2: size2,
        notcompletedtodos: arr2,
        completedtodos: arr1
    };

    res.render('life', {data});
});


// post request for the life section page 
app.post("/add-new-lifetodo", async (req, res) => {
    console.log("adding the new todo in the life section ");
    console.log(req.body);
    const tasktoadd = req.body.tasktoadd;
    console.log("the task to be added is as follows ");
    console.log(tasktoadd);

    // calling the function to add this to the database 
    addNewTodo(presentuser, tasktoadd, "life");

    const reply = {
        msg: "added successfully"
    };

    res.json(reply);

});



app.get("/home", async (req, res) => {
    console.log("user is in the home section");
    const id = String(presentuser.id);
    const currentusertodo = await todolistbase.findOne({ databaseid: id });
    
    let arr1 = new Array;
    let arr2 = new Array;

    arr1 = currentusertodo.completedhome;
    arr2 = currentusertodo.notcompletedhome;

    let size1 = arr1.length;
    let size2 = arr2.length;

    const data = {
        size1: size1,
        size2: size2,
        notcompletedtodos: arr2,
        completedtodos: arr1
    };

    res.render('home', {data});
});


// handling the post request for the home section
app.post('/add-new-hometodo', async (req, res) => {
    console.log("adding the new todo in the home section ");
    console.log(req.body);
    const tasktoadd = req.body.tasktoadd;
    console.log("the task to be added is as follows ");
    console.log(tasktoadd);

    // calling the function to add this to the database 
    addNewTodo(presentuser, tasktoadd, "home");

    const reply = {
        msg: "added successfully"
    };

    res.json(reply);

});



app.get("/college", async (req, res) => {
    console.log("user is in the college section");

    const id = String(presentuser.id);
    const currentusertodo = await todolistbase.findOne({ databaseid: id });
    
    let arr1 = new Array;
    let arr2 = new Array;

    arr1 = currentusertodo.completedcollege;
    arr2 = currentusertodo.notcompletedcollege;

    let size1 = arr1.length;
    let size2 = arr2.length;

    const data = {
        size1: size1,
        size2: size2,
        notcompletedtodos: arr2,
        completedtodos: arr1
    };



    // res.send("the developers are working on college section of todolist");
    res.render('college', {data});
});




// handling the post request for the college part
app.post("/add-new-collegetodo", async (req, res) => {
    console.log("adding the new todo in the college section ");
    console.log(req.body);
    const tasktoadd = req.body.tasktoadd;
    console.log("the task to be added is as follows ");
    console.log(tasktoadd);

    // calling the function to add this to the database 
    addNewTodo(presentuser, tasktoadd, "college");

    const reply = {
        msg: "added successfully"
    };

    res.json(reply);

});





app.get("/personal", async (req, res) => {
    console.log("user is at the personal section");

    
    const id = String(presentuser.id);
    const currentusertodo = await todolistbase.findOne({ databaseid: id });
    
    let arr1 = new Array;
    let arr2 = new Array;

    arr1 = currentusertodo.completedpersonal;
    arr2 = currentusertodo.notcompletedpersonal;

    let size1 = arr1.length;
    let size2 = arr2.length;

    const data = {
        size1: size1,
        size2: size2,
        notcompletedtodos: arr2,
        completedtodos: arr1
    };



    res.render("personal", {data});
});



// handling the post request for the personal section 
app.post("/add-new-personaltodo", async (req, res) => {
    console.log("adding the new todo in the personal section ");
    console.log(req.body);
    const tasktoadd = req.body.tasktoadd;
    console.log("the task to be added is as follows ");
    console.log(tasktoadd);

    // calling the function to add this to the database 
    addNewTodo(presentuser, tasktoadd, "personal");

    const reply = {
        msg: "added successfully"
    };

    res.json(reply);

});





app.post("/reqfromclient", (req, res) => {
    console.log("request from the client side is received successfully ");
    console.log("the 1st stage is completed");
    console.log("the data from the client side is as follows");
    console.log(req.body);

    const reply = {
        msg: "successfully got the response from the sever side "
    };

    res.json(reply);
});





// codes for the notes section 
app.get('/notes', async (req, res) => {
    if (presentuser == 1) {
        console.log("the user is not signed it yet");
        // res.send("go to home page and signin first to access this ");
        res.render('404');
     }
    console.log("i am on the notes section page");
    const id = String(presentuser.id);

    const currentusertodo = await todolistbase.findOne({ databaseid: id });
    let notesarr = new Array;
    currentusertodo.notes.forEach(element => {
        element = element.replace(/\s+/g,' ').trim();
        notesarr.push(element.substr(0, 150));
    });
    // notesarr = currentusertodo.notes;
    console.log("the current notes are as follows ");
    console.log(notesarr);
    let notestitle = new Array;
    notestitle = currentusertodo.notestitle;

    const data = {
        notesarr: notesarr,
        size: notesarr.length,
        notestitle: notestitle
    };

    console.log("everything sent to the frontend with proper execution of the plan");
    res.render('notes', { data });


});




// defining the function to add the new note to the datavbase of the user 
async function addNewNote(currentusertodo, newnote, newtitle) {
    console.log("write now i am in addnewnote func to add the new note to base ");
    newnote = newnote.replace(/\s+/g, ' ').trim();
    newtitle = newtitle.replace(/\s+/g,' ').trim();
    // newnote = newnote.trim();
    let arr = new Array;
    arr = currentusertodo.notes;
    // currentusertodo.notes.forEach(element => {
    //     arr.push(element);
    // });
    console.log("the notes array before adding the newnote");
    console.log(arr);
    arr.push(newnote);
    console.log("the notes array after adding the newnote ");
    console.log(arr);

    let titlearr = new Array;
    // currentusertodo.notestitle.forEach(element => {
    //     titlearr.push(element);
    // });
    titlearr = currentusertodo.notestitle;
    titlearr.push(newtitle);

    const id = String(presentuser.id);

    const result1 = await todolistbase.updateOne({ databaseid: id }, {
        $set: {
            notes: arr,
            notestitle: titlearr
        }
    });

    console.log("this is successfully updated the result is as follows ");
    console.log(result1);
    
    // say everything went fine
    return;
}





app.post('/addnotes', async (req, res) => {
    console.log("adding the new note to the database ");
    console.log(req.body);
    const newnote = req.body.newnote;
    const newtitle = req.body.newtitle;

    console.log("the new note to be added along with the topic is as follows ");
    console.log(newtitle);
    console.log(newnote);
    
    const id = String(presentuser.id);

    const currentusertodo = await todolistbase.findOne({ databaseid: id });

    addNewNote(currentusertodo, newnote, newtitle);

    console.log("this has been added successfully ");

    const reply = {
        msg: "successfully executed , the plan B"
    };

    res.json(reply);
});



// defining the function to delete the required note from the database 
async function deleteNote(currentusertodo, notetodelete) {
    console.log("deleting the note");
    let arr = new Array;
    let index = 0;
    let k = 0;
    currentusertodo.notes.forEach(element => {
        let ele1 = element.trim();
        notetodelete = notetodelete.trim();
        ele1 = ele1.replace(/\n/g, " ");
        ele1 = ele1.substr(0, 150);
        notetodelete = notetodelete.replace(/\n/g, " ");
        console.log("the strings after replcaing is as follows");
        console.log(ele1);
        console.log(notetodelete);

        if (ele1 != notetodelete) {
            arr.push(ele1);
        }
        else {
            index = k;
        }
        k++;
    });

    let titletodelete = currentusertodo.notestitle[index];
    console.log("the title to delete is as follows");
    console.log(titletodelete);

    let titlearr = new Array;

    // also updating the value of the title of the user 
    currentusertodo.notestitle.forEach(element => {
        if (element != titletodelete) {
            titlearr.push(element);
        }
    });

    console.log("the array after deleting the note is as follows ");
    console.log(arr);
    const id = String(presentuser.id);

    const result = await todolistbase.updateOne({ databaseid: id }, {
        $set: {
            notes: arr,
            notestitle: titlearr
        }
    });

    console.log("the deletion is succesfull from the database");
    console.log(result);

}




// now handling the code for the deleting the note from the database 
app.post("/deletenote", async (req, res) => {
    console.log("we are deleting the note from the database ");
    console.log(req.body);
    let notetodelete = req.body.notetodelete;
    console.log("the note to be deleted is as follows");
    notetodelete = notetodelete.replace(/\s+/g,' ').trim();
    console.log(notetodelete);
    const id = String(presentuser.id);

    const currentusertodo = await todolistbase.findOne({ databaseid: id });

    // calling the function for this purpose 
    deleteNote(currentusertodo, notetodelete);

    const reply = {
        msg: "the mission is successfully completed"
    };

    // say everything went fine s
    res.json(reply);
});


let index1 = 0;

// now showing the full note for this purpose 
app.get("/showfullnote", async (req, res) => {
    console.log("showing the full note ");
    // console.log(req.body);
    console.log("the index of the note in the original array is as follows ");
    console.log(index1);
    const id = String(presentuser.id);
    const currentusertodo = await todolistbase.findOne({ databaseid: id });
    const currentnote = currentusertodo.notes[index1];
    const title = currentusertodo.notestitle[index1];
    console.log(currentnote);
    console.log(title);

    const data = {
        topic: title,
        note: currentnote
    };

    // say everything went fine 
    res.render('shownotes', {data});

});


app.post("/showfullnote", async (req, res) => {
    console.log(req.body);
    index1 = req.body.index;
    const reply = {
        msg: "the index has been sent succecssfully for this purpose ",
    };

    res.json(reply);
})




// writing the code for the your arena section for the better experience 
app.get("/yourarena", (req, res) => {
    console.log("hi i am at the yourarena page for the better experience");
    res.render('yourarena');
});

app.get("/calculator", (req, res) => {
    console.log("right now user is using the calculator for this purpose ");
    res.render('yourarena');
});


app.get("/counter", (req, res) => {
    console.log("the user is on the counter page for using the counter ");
    res.render('counter');
});

app.get("/timer", (req, res) => {
    console.log("the user is on the timer for using the timer");
    res.render("timer");
});


// now writing the code to lsiten to the servet that weh ave right now
app.listen(port, () => {
    console.log(`listening to the port with port no ${port}`);

});