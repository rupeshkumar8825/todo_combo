// const { compareSync } = require("bcrypt");

const eachtasknotcomp = document.querySelectorAll(".eachtask");
console.log(eachtasknotcomp);
console.log(eachtasknotcomp.length);

const eachtasknotcomph2list = document.querySelectorAll(".eachtask-list");
console.log(eachtasknotcomph2list);
console.log(eachtasknotcomph2list.length);

// using the for to store all the current notcompleted todos into the array to delete and tick 
let eachtasknotcomph2arr = new Array;
for (let i = 0; i < eachtasknotcomph2list.length; i++) {
    console.log("the content of the first h2 element is as follows for the not completed one");
    console.log(eachtasknotcomph2list[i].innerText);
    eachtasknotcomph2arr.push((eachtasknotcomph2list[i].innerText));
}


// using the for loop for printing the array that we got 
console.log("the todolistarr is as follows");
eachtasknotcomph2arr.forEach(element => {
    console.log(element);
});





const eachtaskofcomp = document.querySelectorAll('.eachtask1');
console.log(eachtaskofcomp);
console.log(eachtaskofcomp.length);

const eachtaskofcomph2list = document.querySelectorAll(".eachtask1-list");
console.log("the already completed todos is as follows ");
console.log(eachtaskofcomph2list);
console.log("the length of this array is as follows");
console.log(eachtaskofcomph2list.length);


let eachtaskofcomph2arr = new Array;

for (let i = 0; i < eachtaskofcomph2list.length; i++) {
    eachtaskofcomph2arr.push(eachtaskofcomph2list[i].innerText);
}

console.log("finally the array is as follows ");
console.log(eachtaskofcomph2arr);





// now defining the new array to store the newly added tasks in the work section 
let newtaskofnotcomp = new Array;
let newtaskofnotcomp_index = 0;

let newtickedtasks = new Array;
let newtickedtasks_index = 0;

const addtaskform = document.getElementsByClassName('addtaskform');

addtaskform[0].addEventListener('submit', async function (event) {
    event.preventDefault();
    const inputtask = document.getElementById("inputtask");
    const tasktoadd = inputtask.value;
    console.log("the task to added to the work section is as follows ");
    console.log(tasktoadd);

    newtaskofnotcomp.push(tasktoadd);
    newtaskofnotcomp_index++;
    const data = {
        tasktoadd: tasktoadd
    };

    
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(data)
    };

    const response = await fetch("/add-new-personaltodo", options);
    const response_data = await response.json();
    console.log("the response from the server side is as follows ");
    console.log(response_data);


    console.log("done successfully");

    // now i have to show that stuff on the page without refreshing 
    // so lets create the dom elements using the vanilla js 
    const newdiv = document.createElement('div');
    newdiv.className = "temp_eachtask";

    const newh2 = document.createElement("h2");
    newh2.className = "eachtask-list";
    newh2.innerHTML = tasktoadd;

    const newtickbtn = document.createElement('button');
    newtickbtn.type = "submit";
    newtickbtn.id = "tick";
    newtickbtn.name = "tick";
    newtickbtn.setAttribute("onclick", `ticktask(${newtaskofnotcomp_index-1}, ${1})`)    
    newtickbtn.innerHTML = "Tick";
    
    
    const newdeletebtn = document.createElement('button');
    newdeletebtn.type = "submit";
    newdeletebtn.id = "delete";
    newdeletebtn.name = "delete";
    newdeletebtn.setAttribute("onclick", `deletenotcompletedtask(${newtaskofnotcomp_index - 1}, ${1})`);
    newdeletebtn.innerHTML = "Delete";

    newdiv.appendChild(newtickbtn);
    newdiv.appendChild(newh2);
    newdiv.appendChild(newdeletebtn);
    
    // now we just  have to append them in proper way
    const notcompletedtodos = document.getElementById('notcomptodos');
    notcompletedtodos.appendChild(newdiv);
    
    console.log("the created DOM element is as follows ");
    console.log(notcompletedtodos);

});



// now we have to add the delete functionality for this section 

async function deletenotcompletedtask(index, gateway) {
    console.log("the gateway for this element is as follows ");
    console.log(gateway);

    console.log("the index of this is as follows ");
    console.log(index);
    let tasktodelete = ""
    if (gateway == 0) {
        console.log("this means that this comes from the already tasks ");
        tasktodelete = eachtasknotcomph2arr[index];
        console.log("the task to be deleted is as follows ");
        console.log(tasktodelete);

        eachtasknotcomp[index].style.display = "none";
    }   
    else {
        console.log("this means that this comes from the newly added tasks to the notcomp");
        tasktodelete = newtaskofnotcomp[index];
        console.log("the task to delete is as follows");
        console.log(tasktodelete);

        const temp_eachtask = document.querySelectorAll(".temp_eachtask");
        temp_eachtask[index].style.display = "none";

    }

    // now we can make a fetch request to the server side from the client side 
        // now we have to make a fetch request to the server side to delete this task from completed section 
    const data = {
        tasktodelete: tasktodelete
    };
    

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(data)
    };

    const response = await fetch("/todolist-viewallpage-delete", options);
    const response_data = await response.json();
    console.log("the response from the server side is as follows ");
    console.log(response_data);

}




// now we have to implement the tick function here 
async function ticktask(index, gateway) {
    console.log("right now i am marking your task as completed");

    console.log("the gateway for this task is as follows ");
    console.log(gateway);
    console.log("the index is as follows ");
    console.log(index);

    let tasktotick = "";

    if (gateway == 0) {
        console.log("this means we have to tick the element from the already added task");
        tasktotick = eachtasknotcomph2arr[index];

        eachtasknotcomp[index].style.display = "none";
    }
    else {
        console.log("this means we have to tick the newly added task before refreshing");
        tasktotick = newtaskofnotcomp[index];

        const temp_eachtask = document.querySelectorAll(".temp_eachtask");
        temp_eachtask[index].style.display = "none";        
    }

    console.log("the tasktotick is as follows");
    console.log(tasktotick);
    newtickedtasks.push(tasktotick);
    newtickedtasks_index++;
    // creating the new DOM element for showing the ticked part here until the page is not 
    // refreshed yet 
    const newdiv = document.createElement("div");
    const newh2 = document.createElement("h2");
    const newbtn = document.createElement("button");

    newdiv.className = "temp_eachtask1";

    
    newh2.innerHTML = tasktotick;
    newh2.className = "eachtask1-list";
    

    newbtn.innerHTML = "Delete";
    newbtn.type = "submit";
    newbtn.id = "delete";
    newbtn.value = `${index}`
    newbtn.setAttribute("onclick", `deletecompletedtask(${newtickedtasks_index-1}, ${1})`)


    newdiv.appendChild(newh2);
    newdiv.appendChild(newbtn);

    const comptodos = document.getElementById("comptodos");
    comptodos.appendChild(newdiv);


    console.log(comptodos);

    
    // now we have to do the fetch reques to the server side to tick the current task 
        // now we have to make a fetch request to the server side from the client side to change the
    // contents of the database without refreshing the page and do the work in background 
    const data = {
        tasktotick: tasktotick
    };

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    };


    // calling the fetch function to contact with the server side from here
    const response = await fetch("/todolist-viewallpage-addtocompleted", options);
    const response_data = await response.json();
    console.log("the resposne from the server side to the client side for proper handshake here ");
    console.log(response_data);

}



// now we have to implement the deletion of the completed tasks for the work section 
async function deletecompletedtask(index, gateway) {
    console.log("the gateway for this is as follows ");
    console.log(gateway);
    console.log("the index is");
    console.log(index);

    let tasktodelete = "";

    if (gateway == 0) {
        console.log("this means that we have to delete the task that is already completed");
        tasktodelete = eachtaskofcomph2arr[index];
        eachtaskofcomp[index].style.display = "none";
    } else {
        console.log("this means that we have to delete the newly completed task for work");
        tasktodelete = newtickedtasks[index];

        const temp_eachtask1 = document.querySelectorAll(".temp_eachtask1");
        temp_eachtask1[index].style.display = "none";

    }

    console.log("the task to be deleted is as follows ");
    console.log(tasktodelete);

    // now we have to make a fetch request to the server side from the client side 
    // so that we can update the stuff in the background without refreshing the page 
    // this improves the user interface experience for the website 
    const data = {
        tasktodelete: tasktodelete
    };
    

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(data)
    };

    const response = await fetch("/delete-completed-todos", options);
    const response_data = await response.json();
    console.log("the response from the server side is as follows ");
    console.log(response_data);
    
}






