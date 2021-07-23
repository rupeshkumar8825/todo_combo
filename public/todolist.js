const todo = document.querySelectorAll('.todo');
console.log(todo);
console.log(todo.length);




// this is the list of the notcompleted todos of the particular user 
const todolist = document.querySelectorAll('.todo-list');
console.log("the not completed todos h2 content");
console.log("the length is ");
console.log(todolist.length);



// using the for to store all the current notcompleted todos into the array to delete and tick
let todolistarr = new Array;
for (let i = 0; i < todolist.length; i++) {
    console.log("the content of the first h2 element is as follows for the not completed one");
    console.log(todolist[i].innerText);
    todolistarr.push((todolist[i].innerText));
}




// using the for loop for printing the array that we got 
console.log("the todolistarr is as follows");
todolistarr.forEach(element => {
    console.log(element);
});





async function newfunc(index) {
    console.log("right now i am in newfunc function for the deleting this todo task");
    console.log(index);
    console.log("the task to be deleted is as follows ");
    console.log(todolistarr[index]);
    const data = {
        tasktodelete: todolistarr[index]
    };

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    };

    const response = await fetch('/todolist-viewallpage-delete', options);
    const response_data = await response.json();
    console.log(response_data);

    todo[index].style.display = "none";

}




let newcompletedtask = 0;
let newcompletedtaskarr = new Array;

// adding the functionality to mark the todo as completed 
async function tickfunc(index) {
    console.log("the index of the task to be deleted is as follows ");
    console.log(index);

    console.log("the task to be deleted is ");
    console.log(todolistarr[index]);


    todo[index].style.display = "none";


    // now we have to make a fetch request to the server side from the client side to change the
    // contents of the database without refreshing the page and do the work in background 
    const data = {
        tasktotick: todolistarr[index]
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


    // now we have to add this element to the completed section using the DOM manipulation
    const newtodo1 = document.createElement('div');
    newtodo1.className = "temp_todo1";
    const newh2 = document.createElement('h2');
    newh2.className = "todo1-list";

    const newbtn = document.createElement('button');
    newbtn.className = "deleteticked";
    newbtn.id = "delete";
    newbtn.name = "index";
    newbtn.value = newcompletedtask;
    newcompletedtask++;
    newh2.innerHTML = todolistarr[index];
    newbtn.innerHTML = "Delete";
    newbtn.setAttribute('onclick', `deleteticked(${newcompletedtask-1}, ${1})`)

    newtodo1.appendChild(newh2);
    newtodo1.appendChild(newbtn);
    document.getElementById('comptodos').appendChild(newtodo1);
    
    
    newcompletedtaskarr.push(todolistarr[index]);
    console.log("the recently added task to completed section is as follows");
    newcompletedtaskarr.forEach(element => {
        console.log(element);
    });



    console.log("the appended element is as follows the newtodo1 ");
    console.log(newtodo1);
    console.log("Congrats, the task completed successfully ");
}




const todo1 = document.querySelectorAll('.todo1');
console.log(todo1);
console.log(todo1.length);


const todolist1 = document.querySelectorAll(".todo1-list");
console.log("the already completed todos is as follows ");
console.log(todolist1);
console.log("the length of this array is as follows");
console.log(todolist1.length);



let todolist1arr = new Array;



for (let i = 0; i < todolist1.length; i++) {
    todolist1arr.push(todolist1[i].innerText);
}



console.log("finally the array is as follows ");
console.log(todolist1arr);



// now writing the js for deleting the completed todos
async function deleteticked(index, gateway) {

    console.log("the index that needs to deleted is ");
    console.log(index);
    console.log("the gateway from which this is coming is as follows ");
    console.log(gateway);

    let tasktodelete = "";

    // applying the if else statement 
    if (gateway == 0) {
        // this means that this is coming from the aready completedtodo 
        tasktodelete = todolist1arr[index];
        todo1[index].style.display = "none";

    } else {
        tasktodelete = newcompletedtaskarr[index];
        // we have to grab the new addedd task to completed section 
        const temp_todo1 = document.getElementsByClassName("temp_todo1");
        console.log("the newly added todos list is as follows ");
        console.log(temp_todo1);
        console.log(temp_todo1.length);

        // now we have to make the index element invisible to delete from the list 
        temp_todo1[index].style.display = "none";
    }

    console.log("the task to be deleted from the completed section is as follows ");
    console.log(tasktodelete);

    // now we have to make a fetch request to the server side to delete this task from completed section 
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




